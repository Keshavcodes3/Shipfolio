import { Router } from 'express';
import { communityController } from '../controller/community.controller.js';
import { authenticateRequest, optionalAuthenticateRequest } from '../../../middleware/auth.middleware.js';

const router = Router();

// Public
router.get('/posts', optionalAuthenticateRequest, communityController.getPosts);
router.get('/posts/:id', optionalAuthenticateRequest, communityController.getPost);
router.get('/stats', communityController.getStats);
router.get('/categories', communityController.getCategories);
router.get('/recent-authors', communityController.getRecentAuthors);
router.get('/posts/:id/comments', communityController.getComments);

// Auth required
router.post('/posts', authenticateRequest, communityController.createPost);
router.put('/posts/:id', authenticateRequest, communityController.updatePost);
router.delete('/posts/:id', authenticateRequest, communityController.deletePost);
router.post('/posts/:id/pin', authenticateRequest, communityController.togglePin);
router.post('/posts/:id/upvote', authenticateRequest, communityController.toggleUpvote);
router.post('/posts/:id/comments', authenticateRequest, communityController.createComment);
router.delete('/posts/:postId/comments/:commentId', authenticateRequest, communityController.deleteComment);

export default router;
