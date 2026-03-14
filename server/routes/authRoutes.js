import express from 'express'
import { signup,login,verifyUserToken, updateProfile } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/verify', verifyUserToken);
router.put('/update-profile', updateProfile)
export default router;