import Book from "../models/Book.js";
import Review from "../models/Review.js";

export const searchBooks = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ message: 'Search query "q" is required' });
    }

    try {
        const searchRegex = new RegExp(q, 'i'); // i for case-insensitive
        const books = await Book.find({
            $or: [{ title: searchRegex }, { author: searchRegex }],
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const addBook = async (req, res) => {
    const { title, author, genre } = req.body;
    try {
        const book = new Book({ title, author, genre });
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: 'Error adding book', error: error.message });
    }
}

export const getAllBooks = async (req, res) => {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const query = {};

    if (author) query.author = author;
    if (genre) query.genre = genre;

    try {
        const books = await Book.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Book.countDocuments(query);

        res.json({
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const getBookById = async (req, res) => {
    try {
        // Pagination for reviews
        const { page = 1, limit = 5 } = req.query;

        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const reviews = await Review.find({ book: req.params.id })
            .populate('user', 'username') // Populate user info
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const reviewCount = await Review.countDocuments({ book: req.params.id });

        // Manually calculate average rating since virtuals don't work perfectly with findById alone
        const allReviewsForBook = await Review.find({ book: req.params.id });
        let averageRating = 0;
        if (allReviewsForBook.length > 0) {
            const totalRating = allReviewsForBook.reduce((acc, item) => acc + item.rating, 0);
            averageRating = (totalRating / allReviewsForBook.length).toFixed(1);
        }

        res.json({
            book,
            averageRating: parseFloat(averageRating),
            reviews: {
                data: reviews,
                totalPages: Math.ceil(reviewCount / limit),
                currentPage: parseInt(page),
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}