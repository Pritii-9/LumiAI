import { Request, Response } from 'express';
import Interview from '../models/Interview';

// GET /api/interviews?userEmail=...&limit=...
export const getInterviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userEmail, limit } = req.query;
    const query = userEmail ? { userEmail: String(userEmail) } : {};
    const limitNum = limit ? Number(limit) : 0;

    let cursor = Interview.find(query).sort({ created_at: -1 });
    if (limitNum > 0) cursor = cursor.limit(limitNum);

    const interviews = await cursor.lean();
    res.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(503).json({ error: 'Unable to connect to the database right now.' });
  }
};

// GET /api/interviews/:interview_id
export const getInterviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interview_id } = req.params;
    const interview = await Interview.findOne({ interview_id }).lean();

    if (!interview) {
      res.status(404).json({ error: 'Interview not found.' });
      return;
    }

    res.json(interview);
  } catch (error) {
    console.error('Error fetching interview by ID:', error);
    res.status(503).json({ error: 'Unable to connect to the database right now.' });
  }
};

// POST /api/interviews
export const createInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const requiredFields = ['interview_id', 'userEmail', 'jobPosition', 'jobDescription', 'duration', 'type', 'questionList'];
    const missingFields = requiredFields.filter((f) => !data?.[f]);

    if (missingFields.length > 0) {
      res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
      return;
    }

    const interview = new Interview({
      ...data,
      interviewFeedback: [],
      created_at: new Date().toISOString(),
    });

    await interview.save();
    res.status(201).json(interview.toObject());
  } catch (error: any) {
    console.error('Error creating interview:', error);
    if (error.code === 11000) {
      res.status(409).json({ error: 'An interview with this ID already exists.' });
      return;
    }
    res.status(503).json({ error: 'Failed to create interview.' });
  }
};
