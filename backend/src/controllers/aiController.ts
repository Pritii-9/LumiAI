import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import { generateFallbackInterviewQuestions } from '../utils/aiFallback';
import { QUESTION_PROMPT, FEEDBACK_PROMPT } from '../utils/constants';

// Primary model: fast + high quality. Fallback: smaller but still great.
const PRIMARY_MODEL = 'llama-3.3-70b-versatile';
const FALLBACK_MODEL = 'llama3-8b-8192';

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

  const finalPrompt = QUESTION_PROMPT
    .replace('{{jobTitle}}', jobPosition)
    .replace('{{jobDescription}}', jobDescription)
    .replace('{{duration}}', duration)
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
