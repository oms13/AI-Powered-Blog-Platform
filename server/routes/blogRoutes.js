import express from 'express'
import { aiGenerator,publish,blogInfo,toggleLike } from '../controllers/blogController.js';
const router = express.Router();

router.post('/aiService',aiGenerator);
router.post('/publish',publish);
router.post('/blog-info',blogInfo);
router.post('/toggle-like',toggleLike);

export default router;