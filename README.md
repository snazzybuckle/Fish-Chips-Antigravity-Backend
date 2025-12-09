# Fish & Chips Backend

This contains the backend API for the Fish & Chips e-commerce application. It is built with Node.js, Express, and MySQL, providing authentication and cart management functionality.

## 🛠️ Tech Stack

- **Node.js**: Runtime environment
- **Express**: Web framework
- **MySQL2**: Database driver
- **JWT (jsonwebtoken)**: User authentication
- **Bcryptjs**: Password hashing
- **Helmet**: Security headers
- **Express-Rate-Limit**: Request rate limiting
- **Cors**: Cross-Origin Resource Sharing

## 📂 Project Structure

```
backend/
├── routes/          # API route definitions
│   ├── authRoutes.js   # Authentication endpoints
│   └── cartRoutes.js   # Shopping cart endpoints
├── db.js            # Database connection configuration
├── server.js        # Main entry point and server setup
├── .env             # Environment variables (not committed)
└── package.json     # Project dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MySQL Server installed and running

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend` folder with the following contents (adjust as needed):
   ```env
   PORT=10000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=fish_chips_db
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5500
   ```

4. Database Setup:
   Ensure your MySQL server creates the `fish_chips_db` database and necessary tables. (Refer to provided SQL scripts or schema documentation if available).

### Running the Server

Start the development server:
```bash
npm start
```
The server will run on `http://localhost:3000` (or your specified PORT).

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user
- `POST /login`: Login and receive a JWT

### Cart (`/api/cart`)
- `GET /`: Get current user's cart
- `POST /add`: Add item to cart
- `POST /remove`: Remove item from cart
- `POST /update`: Update item quantity

## 🔒 Security Features

- **Rate Limiting**: Limits repeated requests from the same IP.
- **Helmet**: Adds secure HTTP headers.
- **Secure Cookies (Planned)**: For safer token storage.
