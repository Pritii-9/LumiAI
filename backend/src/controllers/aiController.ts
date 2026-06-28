import { Request, Response } from 'express';
import Groq from 'groq-sdk';
const pdfModule = require('pdf-parse');
import { generateFallbackInterviewQuestions } from '../utils/aiFallback';
import { QUESTION_PROMPT, FEEDBACK_PROMPT, RESUME_PARSE_PROMPT } from '../utils/constants';

// Primary model: fast + high quality. Fallback: smaller but still great.
const PRIMARY_MODEL = 'llama-3.3-70b-versatile';
const FALLBACK_MODEL = 'llama3-8b-8192';

/**
 * pdf-parse v2 API (from their README):
 *   const parser = new PDFParse({ data: buffer });
 *   const result = await parser.getText();
 *   console.log(result.text);   // all pages joined
 *
 * v1 was: pdfParse(buffer) => { text }
 * This wrapper handles both.
 */
async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  // v1: the module itself is a callable function
  if (typeof pdfModule === 'function') {
    const result = await pdfModule(buffer);
    return result.text || '';
  }

  // v2: class-based — pass buffer as { data: buffer }, then call getText() directly
  if (pdfModule.PDFParse) {
    const parser = new pdfModule.PDFParse({ data: buffer });
    const result = await parser.getText();

    // result.text is all pages joined as a single string
    if (typeof result === 'string') return result;
    if (result && typeof result.text === 'string') return result.text;
    if (result && Array.isArray(result.pages)) {
      return result.pages.map((p: any) => p.text || '').join('\n');
    }
    return String(result || '');
  }

  throw new Error('pdf-parse: unrecognised module export shape');
}


// Strip markdown code fences that Groq sometimes wraps JSON in
function extractJson(raw: string): string {
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) return raw.slice(firstBrace, lastBrace + 1);
  return raw.trim();
}

function getGroqClient(): Groq | null {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  return new Groq({ apiKey: key });
}

// POST /api/ai/generate-questions
export const generateQuestions = async (req: Request, res: Response): Promise<void> => {
  const { jobPosition, jobDescription, duration, type } = req.body;

  if (!jobPosition || !jobDescription || !duration || !type) {
    res.status(400).json({ error: 'jobPosition, jobDescription, duration and type are required.' });
    return;
  }

  let resumeText = 'Not provided';
  if (req.file) {
    try {
      const raw = await parsePdfBuffer(req.file.buffer);
      resumeText = raw.substring(0, 15000); // Prevent massive payloads
    } catch (err) {
      console.error('Failed to parse PDF resume:', err);
      resumeText = 'Failed to parse resume';
    }
  }

  const finalPrompt = QUESTION_PROMPT
    .replace('{{jobTitle}}', jobPosition)
    .replace('{{jobDescription}}', jobDescription)
    .replace('{{duration}}', duration)
    .replace('{{resumeText}}', resumeText)
    .replace('{{type}}', Array.isArray(type) ? type.join(', ') : type);

  const groq = getGroqClient();
  if (!groq) {
    res.json({
      content: JSON.stringify(generateFallbackInterviewQuestions({ jobPosition, jobDescription, duration, type })),
      source: 'fallback',
      warning: 'GROQ_API_KEY is not configured.',
    });
    return;
  }

  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError: any = null;

  for (const model of models) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical interviewer. Always respond with valid JSON only, no markdown.',
          },
          { role: 'user', content: finalPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      });
      const raw = completion.choices[0]?.message?.content ?? '{}';
      res.json({ content: extractJson(raw), source: `groq/${model}` });
      return;
    } catch (error: any) {
      lastError = error;
      console.error(`Groq model ${model} failed:`, error?.message);
      if (error?.status !== 429 && error?.status !== 503) break;
    }
  }

  res.json({
    content: JSON.stringify(generateFallbackInterviewQuestions({ jobPosition, jobDescription, duration, type })),
    source: 'fallback',
    warning: lastError?.status === 429
      ? 'Groq is rate-limited. Generated fallback questions.'
      : 'Groq unavailable. Generated fallback questions.',
  });
};

// POST /api/ai/generate-feedback
export const generateFeedback = async (req: Request, res: Response): Promise<void> => {
  const { conversation } = req.body;

  const emptyFeedback = {
    content: JSON.stringify({
      feedback: {
        rating: { technicalSkills: 0, communication: 0, problemSolving: 0, experience: 0 },
        summary: 'No conversation available.',
        recommendation: false,
        recommendationMessage: 'Interview transcript was empty.',
      },
    }),
  };

  if (!conversation || conversation.trim() === '""' || conversation.trim() === '[]') {
    res.json(emptyFeedback);
    return;
  }

  const finalPrompt = FEEDBACK_PROMPT.replace('{{conversation}}', conversation);
  const groq = getGroqClient();

  if (!groq) {
    res.json(emptyFeedback);
    return;
  }

  try {
    const completion = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert hiring manager. Evaluate interview transcripts and respond with valid JSON only, no markdown.',
        },
        { role: 'user', content: finalPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const jsonStr = extractJson(raw);
    const parsed = JSON.parse(jsonStr);
    res.json({ content: JSON.stringify(parsed) });
  } catch (error: any) {
    console.error('Error generating feedback with Groq:', error?.message);
    res.json({
      content: JSON.stringify({
        feedback: {
          rating: { technicalSkills: 0, communication: 0, problemSolving: 0, experience: 0 },
          summary: 'An error occurred during feedback generation.',
          recommendation: false,
          recommendationMessage: 'Server-side error during AI processing.',
        },
      }),
    });
  }
};

// POST /api/ai/parse-resume
export const parseResume = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No resume file provided.' });
    return;
  }

  let resumeText = '';
  try {
    const raw = await parsePdfBuffer(req.file.buffer);
    resumeText = raw.substring(0, 12000);
  } catch (err) {
    console.error('parsePdfBuffer error:', err);
    res.status(422).json({ error: 'Failed to parse PDF. Ensure it is a valid, text-based PDF.' });
    return;
  }

  const groq = getGroqClient();
  if (!groq) {
    // Return a minimal fallback so the UI doesn't break
    res.json({ name: 'Candidate', skills: [], experienceSummary: 'Resume parsed (AI unavailable).' });
    return;
  }

  const finalPrompt = RESUME_PARSE_PROMPT.replace('{{resumeText}}', resumeText);

  try {
    const completion = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume parser. Extract structured data and respond with valid JSON only, no markdown.',
        },
        { role: 'user', content: finalPrompt },
      ],
      temperature: 0.2,
      max_tokens: 512,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(extractJson(raw));
    res.json(parsed);
  } catch (error: any) {
    console.error('Error parsing resume with Groq:', error?.message);
    res.status(500).json({ error: 'Failed to extract resume insights.' });
  }
};
