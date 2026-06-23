import { Router } from 'express';
import { saveFeedback } from '../controllers/feedbackController';

const router = Router();

router.post('/', saveFeedback);

export default router;
