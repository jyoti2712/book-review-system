import { Router } from "express";
import { addReview, deleteReview, updateReview } from "../controller/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const { protect } = authMiddleware;

const router = Router({ mergeParams: true });

router.post("/books/:bookId/reviews", protect, addReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;