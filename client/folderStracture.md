hotel-management-client/
│
├── public/
│   ├── favicon.ico
│   ├── hotel-logo.png
│   └── manifest.json
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/        # Global CSS, Tailwind config
│   │
│   ├── components/
│   │   ├── common/        # Reusable UI (Buttons, Inputs, Modals, Table)
│   │   ├── layout/        # Navbar, Sidebar, Footer
│   │   ├── charts/        # Revenue charts, Room status charts
│   │   └── widgets/       # Dashboard widgets (KPIs)
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   └── useRoleGuard.js
│   │
│   ├── context/           # If using Context API
│   │   └── AuthContext.js
│   │
│   ├── store/             # If using Redux Toolkit
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── bookingSlice.js
│   │   ├── roomSlice.js
│   │   └── dashboardSlice.js
│   │
│   ├── services/          # API layer (Axios)
│   │   ├── axiosConfig.js
│   │   ├── auth.service.js
│   │   ├── rooms.service.js
│   │   ├── booking.service.js
│   │   ├── users.service.js
│   │   └── payments.service.js
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RoomsManagement.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── HotelSettings.jsx
│   │   │   └── Reports.jsx
│   │   │
│   │   ├── receptionist/
│   │   │   ├── ReceptionDashboard.jsx
│   │   │   ├── CheckIn.jsx
│   │   │   ├── CheckOut.jsx
│   │   │   └── ManageBookings.jsx
│   │   │
│   │   ├── guest/
│   │   │   ├── GuestDashboard.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── rooms/
│   │   │   ├── RoomsList.jsx
│   │   │   └── RoomDetails.jsx
│   │   │
│   │   ├── booking/
│   │   │   ├── CreateBooking.jsx
│   │   │   ├── BookingSummary.jsx
│   │   │   └── Payment.jsx
│   │   │
│   │   └── error/
│   │       └── NotFound.jsx
│   │
│   ├── utils/
│   │   ├── formatDate.js
│   │   ├── money.js
│   │   ├── validator.js
│   │   └── constants.js
│   │
│   ├── routes/
│   │   ├── ProtectedRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   └── AppRoutes.jsx
│   │
│   ├── config/
│   │   └── environment.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
└── README.md
