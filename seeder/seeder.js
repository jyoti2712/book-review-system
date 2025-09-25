import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config();

// Load models
import Book from '../models/Book.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Read JSON files
const books = JSON.parse(
    fs.readFileSync(`${__dirname}/data/books.json`, 'utf-8')
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8')
);

const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8')
);


// Import into DB
const importData = async () => {
    try {
        await Book.create(books);
        await User.create(users);
        // We will add reviews later once we have user and book IDs
        console.log('Users and Books Imported...');
        
        // Now let's create reviews by linking real users and books
        const createdUsers = await User.find();
        const createdBooks = await Book.find();

        const reviewsToCreate = reviews.map((review, index) => {
           return {
               ...review,
               user: createdUsers[index % createdUsers.length]._id, // Assign users cyclically
               book: createdBooks[index % createdBooks.length]._id // Assign books cyclically
           }
        });
        
        await Review.create(reviewsToCreate);
        console.log('Reviews Imported...');
        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await Book.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Process command line arguments
if (process.argv[2] === '-i') { // node seeder/seeder.js -i
    importData();
} else if (process.argv[2] === '-d') { // node seeder/seeder.js -d
    deleteData();
} else {
    console.log('Please use the -i flag to import data or -d to delete data.');
    process.exit();
}
