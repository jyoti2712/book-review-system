import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
    // We will calculate average rating virtually to avoid storing redundant data
    // and to ensure it's always up-to-date.
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Ensure virtuals are included in JSON output
    toObject: { virtuals: true }
});

// Create a virtual property `reviews` to link to the Review model
BookSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'book',
    justOne: false
});

// Create a virtual property for average rating
BookSchema.virtual('averageRating').get(function() {
    if (this.reviews && this.reviews.length > 0) {
        const total = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        // Return rating rounded to one decimal place
        return (total / this.reviews.length).toFixed(1);
    }
    return 0; // Return 0 if there are no reviews
});

const Book = mongoose.model('Book', BookSchema);
export default Book;