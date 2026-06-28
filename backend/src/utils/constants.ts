export const FEEDBACK_PROMPT = `
{{conversation}}

Based on this interview conversation between the assistant and the candidate,
give feedback for the candidate interview. Rate the candidate out of 10 for technicalSkills, communication, problemSolving, and experience.
Also provide a concise 2-3 sentence summary, a boolean recommendation, and a short recommendationMessage.
Respond with valid JSON only and use this exact shape:

{
  "feedback": {
    "rating": {
      "technicalSkills": 5,
      "communication": 6,
      "problemSolving": 4,
      "experience": 7
    },
    "summary": "Short summary here",
    "recommendation": true,
    "recommendationMessage": "Short hiring recommendation here"
  }
}`;

export const QUESTION_PROMPT = `You are an expert technical interviewer. Based on the following inputs, generate a well-structured list of high-quality interview questions:

- Job Title: {{jobTitle}}
- Job Description: {{jobDescription}}
- Interview Duration: {{duration}}
- Interview Type: {{type}}
- Candidate Resume: {{resumeText}}

Your task is to:

1. Analyze the job description to identify key responsibilities, required skills, and expected experience.
2. If the candidate resume is provided, analyze their actual experience and generate highly targeted questions that cross-reference their resume with the job description. Ask them about specific projects or technologies listed in their resume that apply to the job.
2. Generate a list of interview questions that depends on the interview duration.
3. Adjust the number and depth of questions to match the interview duration.
4. Ensure the questions match the tone and structure of a real-life interview.

Format your response in JSON format with an array list of questions:
{
  "interviewQuestions": [
    {
      "question": "Insert Question",
      "type": "Technical/Behavioral/Experience/Problem Solving/Leadership"
    }
  ]
}

The goal is to create a structured, relevant, and time-optimized interview plan.`;

export const RESUME_PARSE_PROMPT = `You are an expert resume parser. Analyze the following resume text and extract key information.

Resume Text:
{{resumeText}}

Extract and respond with valid JSON in this exact shape:
{
  "name": "Candidate full name or 'Candidate' if not found",
  "skills": ["skill1", "skill2", "skill3", "...up to 12 most relevant technical/professional skills"],
  "experienceSummary": "A concise 2-3 sentence professional summary highlighting the candidate's background, years of experience, and key expertise areas.",
  "yearsOfExperience": "e.g. 3+ years or Fresher"
}`;

