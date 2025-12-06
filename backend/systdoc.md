# Hotel Management System - Backend Documentation

## System Architecture

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Integration**: 
  - Chapa
  - TeleBirr
  - CBE (Commercial Bank of Ethiopia)
  - Awash Bank
- **File Upload**: Multer
- **Logging**: Winston
- **Environment Management**: dotenv
- **API Documentation**: TBD (Swagger/OpenAPI)

### Directory Structure
/backend /config # Configuration files /controllers # Route controllers /middleware # Custom middleware /models # Database models /routes # Route definitions /services # Business logic /utils # Utility functions /validators # Request validation /public/uploads # Uploaded files server.js # Application entry point

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password
- `POST /api/v1/auth/forgotpassword` - Forgot password
- `PUT /api/v1/auth/resetpassword/:resettoken` - Reset password

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get single user
- `POST /api/v1/users` - Create user (Admin only)
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Rooms
- `GET /api/v1/rooms` - Get all rooms
- `GET /api/v1/rooms/available` - Get available rooms
- `GET /api/v1/rooms/stats` - Get room statistics
- `GET /api/v1/rooms/:id` - Get single room
- `POST /api/v1/rooms` - Create room (Admin only)
- `PUT /api/v1/rooms/:id` - Update room (Admin only)
- `DELETE /api/v1/rooms/:id` - Delete room (Admin only)
- `PUT /api/v1/rooms/:id/status` - Update room status

### Bookings
- `GET /api/v1/bookings` - Get all bookings
- `GET /api/v1/bookings/range` - Get bookings by date range
- `GET /api/v1/bookings/stats` - Get booking statistics
- `GET /api/v1/bookings/:id` - Get single booking
- `POST /api/v1/rooms/:roomId/bookings` - Create booking
- `PUT /api/v1/bookings/:id` - Update booking
- `DELETE /api/v1/bookings/:id` - Delete booking (Admin only)
- `PUT /api/v1/bookings/:id/checkin` - Check in guest
- `PUT /api/v1/bookings/:id/checkout` - Check out guest
- `PUT /api/v1/bookings/:id/cancel` - Cancel booking

### Payments
- `GET /api/v1/payments` - Get all payments
- `GET /api/v1/payments/stats` - Get payment statistics
- `GET /api/v1/payments/:id` - Get single payment
- `POST /api/v1/bookings/:bookingId/payments` - Create payment
- `POST /api/v1/bookings/:bookingId/payments/process` - Process payment
- `GET /api/v1/payments/verify/:paymentId` - Verify payment
- `POST /api/v1/payments/webhook/chapa` - Chapa webhook

### Housekeeping
- `GET /api/v1/housekeeping` - Get all tasks
- `GET /api/v1/housekeeping/status/:status` - Get tasks by status
- `GET /api/v1/housekeeping/stats` - Get statistics
- `GET /api/v1/housekeeping/schedule` - Get schedule
- `POST /api/v1/housekeeping` - Create task
- `PUT /api/v1/housekeeping/:id` - Update task
- `PUT /api/v1/housekeeping/:id/assign` - Assign task
- `PUT /api/v1/housekeeping/:id/complete` - Complete task
- `DELETE /api/v1/housekeeping/:id` - Delete task

## Data Models

### User
- name
- email
- password (hashed)
- role (admin, receptionist, housekeeping, guest)
- isActive
- resetPasswordToken
- resetPasswordExpire

### Room
- roomNumber
- roomType
- price
- capacity
- amenities
- status (available, occupied, maintenance, cleaning)
- images

### Booking
- guest (ref: User)
- room (ref: Room)
- checkInDate
- checkOutDate
- guests
- totalAmount
- paymentStatus
- status (confirmed, checked-in, checked-out, cancelled)

### Payment
- booking (ref: Booking)
- guest (ref: User)
- amount
- paymentMethod
- paymentReference
- status (pending, completed, failed, refunded)
- transactionId

### Housekeeping
- room (ref: Room)
- type (cleaning, maintenance, inspection)
- status (pending, in-progress, completed, cancelled)
- priority (low, medium, high)
- assignedTo (ref: User)
- scheduledDate
- completedAt
- notes

## Security
- JWT authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting
- CORS protection
- XSS protection
- NoSQL injection protection
- HTTP headers security (helmet)
- Request validation
- File upload validation

## Error Handling
- Custom error handling middleware
- Development vs production error handling
- Async error handling wrapper
- Validation error handling
- Mongoose error handling

## Environment Variables
NODE_ENV=development PORT=5000 MONGO_URI=mongodb://localhost:27017/hms JWT_SECRET=your_jwt_secret JWT_EXPIRE=30d JWT_COOKIE_EXPIRE=30 FILE_UPLOAD_PATH=./public/uploads MAX_FILE_UPLOAD=1000000 CHAPA_SECRET_KEY=your_chapa_secret CHAPA_WEBHOOK_SECRET=your_webhook_secret TELEBIRR_API_KEY=your_telebirr_key CBE_MERCHANT_ID=your_cbe_merchant CBE_API_KEY=your_cbe_key AWASH_MERCHANT_ID=your_awash_merchant AWASH_API_KEY=your_awash_key SMTP_HOST=smtp.gmail.com SMTP_PORT=587 SMTP_EMAIL=your_email@gmail.com SMTP_PASSWORD=your_email_password FROM_EMAIL=noreply@hms.com FROM_NAME=HMS

