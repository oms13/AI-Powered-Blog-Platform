import express from 'express'
import { aiGenerator,publish,blogInfo,toggleLike,userProfile } from '../controllers/blogController.js';
const router = express.Router();

router.post('/aiService',aiGenerator);
router.post('/publish',publish);
router.post('/blog-info',blogInfo);
router.post('/toggle-like',toggleLike);
router.post('/user-profile',userProfile);

export default router;