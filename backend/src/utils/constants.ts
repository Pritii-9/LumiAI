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

Your task is to:

1. Analyze the job description to identify key responsibilities, required skills, and expected experience.
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
