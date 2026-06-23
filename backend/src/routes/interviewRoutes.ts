import { Router } from 'express';
import { getInterviews, getInterviewById, createInterview } from '../controllers/interviewController';

const router = Router();

router.get('/', getInterviews);
router.get('/:interview_id', getInterviewById);
router.post('/', createInterview);

export default router;
