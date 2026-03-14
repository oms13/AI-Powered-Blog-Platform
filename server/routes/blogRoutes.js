import express from 'express'
import { aiGenerator, publish, blogInfo, toggleLike, userProfile, getFeed,toggleFollow,comment,getComments,deleteComment,toggleCommentLike } from '../controllers/blogController.js';
const router = express.Router();

router.post('/aiService', aiGenerator);
router.post('/publish', publish);
router.post('/blog-info', blogInfo);
router.post('/toggle-like', toggleLike);
router.post('/toggle-follow', toggleFollow);
router.post('/user-profile', userProfile);
router.post('/comment',comment);
router.get('/comments/:blogId', getComments);
router.post('/comment/:blogId/:commentId', deleteComment);
router.post('/comment/like', toggleCommentLike);
router.get('/feed', getFeed);



export default router;