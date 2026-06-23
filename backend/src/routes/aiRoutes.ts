import { Router } from 'express';
import { generateQuestions, generateFeedback } from '../controllers/aiController';

const router = Router();

router.post('/generate-questions', generateQuestions);
router.post('/generate-feedback', generateFeedback);

export default router;
