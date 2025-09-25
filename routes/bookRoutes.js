import express from 'express';
import Router from 'express';
import { addBook, getAllBooks, getBookById, searchBooks } from '../controller/bookController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const { protect } = authMiddleware;

const router = Router();

router.get('/search', searchBooks);
router.post('/', protect, addBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);

export default router;