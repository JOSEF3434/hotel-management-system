# Hotel Management System (HMS)

A comprehensive Hotel Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Management**: Multi-role system (Admin, Receptionist, Housekeeping, Guest)
- **Room Management**: Add, edit, and manage rooms with various types and features
- **Booking System**: Online reservations, check-in/out, and room allocation
- **Billing & Payments**: Invoicing, payment processing, and financial reports
- **Housekeeping**: Room status tracking and task management
- **Inventory Management**: Track hotel assets and supplies
- **Reporting**: Generate various reports (financial, occupancy, etc.)
- **Dashboard**: Real-time overview of hotel operations

## Tech Stack

- **Frontend**: React.js, Redux, Material-UI, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Updates**: Socket.io
- **Payment Integration**: Telebirr, M-PESA, and other payment gateways

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hotel-management-system.git
   cd hotel-management-system
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory
   - Add the following variables:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRE=30d
     NODE_ENV=development
     ```

## Running the Application

1. Start both frontend and backend:
   ```bash
   npm start
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## Project Structure

```
hotel-management-system/
├── backend/               # Backend (Node.js/Express)
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   └── server.js         # Entry point
│
├── frontend/             # Frontend (React)
│   ├── public/           # Static files
│   └── src/
│       ├── assets/       # Images, fonts, etc.
│       ├── components/   # Reusable UI components
│       ├── features/     # Feature-based modules
│       ├── layouts/      # Layout components
│       ├── pages/        # Page components
│       ├── services/     # API services
│       ├── store/        # Redux store
│       ├── utils/        # Utility functions
│       └── App.js        # Main App component
│
├── .gitignore
├── package.json
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
