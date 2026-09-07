import { Router } from 'express';
import { graveyardController } from './graveyard.controller.js';

const router = Router();

router.get('/', graveyardController.getAll);
router.get('/stats', graveyardController.getStats);
router.get('/categories', graveyardController.getCategories);
router.get('/featured', graveyardController.getFeatured);
router.get('/search', graveyardController.search);
router.get('/:slug', graveyardController.getBySlug);
router.get('/category/:category', graveyardController.getByCategory);

export default router;
