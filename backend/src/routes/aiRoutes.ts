import { Router } from 'express';
import multer from 'multer';
import { generateQuestions, generateFeedback, parseResume, generateReply } from '../controllers/aiController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/generate-questions', upload.single('resume'), generateQuestions);
router.post('/generate-feedback', generateFeedback);
router.post('/parse-resume', upload.single('resume'), parseResume);
router.post('/generate-reply', generateReply);

export default router;
