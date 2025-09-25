Book Review API
A RESTful API built with Node.js, Express, and MongoDB for a simple book review system. It includes JWT-based authentication for secure endpoints.

Features
User registration and authentication (/signup, /login).

Authenticated users can add books and submit reviews.

A user can only review a book once.

Users can update or delete their own reviews.

Publicly accessible endpoints to get all books (with filtering and pagination), and single book details.

Book details include its reviews (paginated) and average rating.

Search functionality for books by title or author.

Tech Stack
Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JSON Web Tokens (JWT)

Environment Variables: dotenv

Database Schema
1. User
_id: ObjectId (Primary Key)

username: String (Unique, Required)

password: String (Hashed, Required)

createdAt: Timestamp

updatedAt: Timestamp

2. Book
_id: ObjectId (Primary Key)

title: String (Required)

author: String (Required)

genre: String (Required)

createdAt: Timestamp

updatedAt: Timestamp

Virtuals:

reviews: An array of associated reviews.

averageRating: Calculated average rating from all reviews.

3. Review
_id: ObjectId (Primary Key)

comment: String (Required)

rating: Number (Required, Min: 1, Max: 5)

book: ObjectId (Ref: 'Book', Required)

user: ObjectId (Ref: 'User', Required)

createdAt: Timestamp

updatedAt: Timestamp

Index: A unique compound index on book and user to ensure one review per user per book.

Getting Started
Prerequisites
Node.js (v14 or higher)

MongoDB (or a MongoDB Atlas account)

Project Setup
Clone the repository:

git clone <repository-url>
cd book-review-api

Install dependencies:

npm install

Create a .env file:
Create a file named .env in the root of the project and add the following environment variables.

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

MONGODB_URI: Your connection string for your local or cloud MongoDB instance.

JWT_SECRET: A long, random string used for signing JWTs.

How to Run Locally
Start the development server with:

npm start

The API will be running at http://localhost:5000.

Seeding the Database
You can populate the database with sample data using the seeder script.

To import data:

node seeder -i

To delete all data:

node seeder -d

Example API Requests
Here are some example curl commands. Replace YOUR_TOKEN with the JWT received after logging in.

Authentication
1. Sign Up (Register a new user)

curl -X POST http://localhost:5000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "password": "password123"}'

2. Login

curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "password": "password123"}'

Books
3. Add a New Book (Authenticated)

curl -X POST http://localhost:5000/api/books \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{"title": "The Hobbit", "author": "J.R.R. Tolkien", "genre": "Fantasy"}'

4. Get All Books (with pagination and filters)

# Get page 1, limit 5
curl "http://localhost:5000/api/books?page=1&limit=5"

# Filter by author
curl "http://localhost:5000/api/books?author=J.R.R.%20Tolkien"

5. Get Book by ID (with reviews)
Replace :bookId with an actual book ID.

curl http://localhost:5000/api/books/:bookId

6. Search for Books

curl "http://localhost:5000/api/books/search?q=Hobbit"

Reviews
7. Submit a Review (Authenticated)
Replace :bookId with an actual book ID.

curl -X POST http://localhost:5000/api/reviews/book/:bookId/reviews \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{"rating": 5, "comment": "An absolute classic!"}'

8. Update Your Review (Authenticated)
Replace :reviewId with the ID of the review you created.

curl -X PUT http://localhost:5000/api/reviews/:reviewId \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{"rating": 4, "comment": "Still great, but re-rated it."}'

9. Delete Your Review (Authenticated)
Replace :reviewId with the ID of your review.

curl -X DELETE http://localhost:5000/api/reviews/:reviewId \
-H "Authorization: Bearer YOUR_TOKEN"

Design Decisions & Assumptions
Database Choice: Chose MongoDB as its document-based structure is a natural fit for this kind of application, easily accommodating nested data like reviews within books.

Authentication: JWT was chosen as it is stateless, scalable, and a widely adopted standard for securing REST APIs. Tokens have a 30-day expiration.

Virtual Properties: Mongoose virtuals are used for averageRating and reviews on the Book model. This keeps the database schema clean, avoids data duplication, and ensures the data is always up-to-date when queried.

Error Handling: Basic error handling is in place. Controllers use try...catch blocks to handle server errors and return appropriate status codes (e.g., 400, 401, 404, 500).

Code Structure: The project is structured by feature (models, routes, controllers) for better organization and scalability. A separate config directory handles DB connections and middleware for auth checks.

Pagination: Default pagination is set to 10 items per page but can be customized via query parameters (page, limit).