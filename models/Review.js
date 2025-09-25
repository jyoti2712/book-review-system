import mongoose from 'mongoose';    

const ReviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Please add a comment.'],
        trim: true,
        maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 and 5.'],
        min: 1,
        max: 5
    },
    book: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true
});

// Prevent a user from submitting more than one review per book
ReviewSchema.index({ book: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
