interface FallbackInput {
  jobPosition: string;
  jobDescription: string;
  duration: string;
  type: string | string[];
}

function normalizeTypeList(type: string | string[]): string[] {
  if (Array.isArray(type)) return type.filter(Boolean);
  if (typeof type === 'string' && type.trim()) return [type.trim()];
  return ['General'];
}

function extractSkills(jobDescription = ''): string[] {
  return jobDescription
    .split(/[\n,.]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 12)
    .slice(0, 6);
}

function getQuestionCount(duration: string): number {
  const minutes = parseInt(String(duration), 10);
  if (!isFinite(minutes)) return 8;
  if (minutes <= 5) return 4;
  if (minutes <= 15) return 6;
  if (minutes <= 30) return 8;
  if (minutes <= 45) return 10;
  return 12;
}

function buildQuestionTemplates(jobPosition: string, skills: string[], type: string): { question: string; type: string }[] {
  const skill = skills[0] || 'the core responsibilities in this role';

  const questionMap: Record<string, string[]> = {
    Technical: [
      `Walk me through how you would approach the most important technical challenges in a ${jobPosition} role.`,
      `How have you applied ${skill} in a real project, and what tradeoffs did you consider?`,
      `What would you review first if a production issue appeared in a system you built for this role?`,
    ],
    Behavioral: [
      `Tell me about a time you handled conflicting priorities while working as a ${jobPosition}.`,
      `Describe a situation where you had to collaborate with stakeholders under pressure. What did you do?`,
      `How do you respond when you receive difficult feedback on your work?`,
    ],
    Experience: [
      `Which past experience best prepared you for this ${jobPosition} opportunity, and why?`,
      `What project are you most proud of, and what was your exact contribution?`,
      `How has your experience changed the way you estimate and deliver work?`,
    ],
    'Problem Solving': [
      `If you were asked to improve ${skill} in the first 30 days, how would you break the problem down?`,
      `Describe a complex problem you solved recently and the reasoning you used to get there.`,
      `How do you make progress when the problem is ambiguous and requirements are incomplete?`,
    ],
    Leadership: [
      `How do you influence decisions when you are not the formal owner of a project?`,
      `Tell me about a time you mentored someone or helped raise the quality of a team.`,
      `How would you balance delivery speed with long-term maintainability in this role?`,
    ],
    General: [
      `What makes you a strong fit for this ${jobPosition} role?`,
      `What would success look like for you in the first 90 days?`,
      `Why are you interested in this opportunity right now?`,
    ],
  };

  const templates = questionMap[type] || questionMap['General'];
  return templates.map((q) => ({ question: q, type }));
}

export function generateFallbackInterviewQuestions({ jobPosition, jobDescription, duration, type }: FallbackInput) {
  const normalizedTypes = normalizeTypeList(type);
  const skills = extractSkills(jobDescription);
  const desiredCount = getQuestionCount(duration);
  const questions: { question: string; type: string }[] = [];

  normalizedTypes.forEach((typeName) => {
    buildQuestionTemplates(jobPosition, skills, typeName).forEach((q) => questions.push(q));
  });

  buildQuestionTemplates(jobPosition, skills, 'General').forEach((q) => questions.push(q));

  const uniqueQuestions: { question: string; type: string }[] = [];
  const seen = new Set<string>();

  questions.forEach((item) => {
    if (!seen.has(item.question) && uniqueQuestions.length < desiredCount) {
      seen.add(item.question);
      uniqueQuestions.push(item);
    }
  });

  return { interviewQuestions: uniqueQuestions, generatedBy: 'fallback' };
}
