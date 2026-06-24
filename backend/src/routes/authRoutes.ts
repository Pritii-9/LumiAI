import express from 'express';
import { registerUser, loginUser, getMe, sendOTP } from '../controllers/authController';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile endpoint requires protection, we will stub it here
// router.get('/me', protect, getMe);

export default router;
