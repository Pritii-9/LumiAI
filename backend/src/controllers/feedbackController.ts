import { Request, Response } from 'express';
import Interview from '../models/Interview';

// POST /api/feedback
export const saveFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interview_id, userName, userEmail, feedback, recommend } = req.body;

    if (!interview_id || !userName || !userEmail) {
      res.status(400).json({ error: 'interview_id, userName and userEmail are required.' });
      return;
    }

    const newFeedback = {
      userName,
      userEmail,
      feedback: feedback || {},
      recommend: Boolean(recommend),
      created_at: new Date().toISOString(),
    };

    const updatedInterview = await Interview.findOneAndUpdate(
      { interview_id },
      { $push: { interviewFeedback: newFeedback } },
      { new: true }
    ).lean();

    if (!updatedInterview) {
      res.status(404).json({ error: 'Interview not found.' });
      return;
    }

    res.json(updatedInterview);
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(503).json({ error: 'Failed to save feedback.' });
  }
};
