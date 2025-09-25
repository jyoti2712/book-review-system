import Review from "../models/Review.js";
import Book from "../models/Book.js";

export const addReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { bookId } = req.params;

    try {
        // Check if the book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if user has already reviewed this book
        const existingReview = await Review.findOne({ book: bookId, user: req.user.id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this book' });
        }

        const review = new Review({
            rating,
            comment,
            book: bookId,
            user: req.user.id, // from protect middleware
        });

        const newReview = await review.save();
        res.status(201).json(newReview);

    } catch (error) {
        // Handle potential duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already reviewed this book' });
        }
        res.status(400).json({ message: 'Error adding review', error: error.message });
    }
}

export const updateReview = async (req, res) => {
    const { rating, comment } = req.body;

    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the review belongs to the user
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this review' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        const updatedReview = await review.save();
        res.json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: 'Error updating review', error: error.message });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the review belongs to the user
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this review' });
        }

        await review.deleteOne(); // Use deleteOne() instead of remove()
        res.json({ message: 'Review removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}