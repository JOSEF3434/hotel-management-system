require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load environment variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to database
connectDB();
console.log("MONGO_URI =", process.env.MONGO_URI);

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Allowed frontend origins (dev and production)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175'
].filter(Boolean);

// Initialize Socket.io
const io = socketio(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New WebSocket connection');
  
  // Handle room booking updates
  socket.on('bookingUpdate', (data) => {
    io.emit('bookingUpdate', data);
  });

  // Handle room status updates
  socket.on('roomStatusUpdate', (data) => {
    io.emit('roomStatusUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Set global io object
app.set('io', io);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS (allow local dev ports and configured origin)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks (temporarily disabled due to req.query setter issue)
// app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Prevent http param pollution (disabled due to incompatibility with req.query getter)
// app.use(hpp());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/guests', require('./routes/guests'));
app.use('/api/housekeeping', require('./routes/housekeeping'));
app.use('/api/payments', require('./routes/payments'));

// Error handler middleware
app.use(errorHandler);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found'
  });
});

const serverInstance = server.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`.red);
  // Close server & exit process
  serverInstance.close(() => process.exit(1));
});
