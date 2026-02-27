# School Attendance System

A production-ready attendance management system with geolocation security, unique student IDs, and real-time tracking.

## Features

- **Geolocation Verification**: GPS-based location validation prevents proxy attendance
- **UID System**: Unique immutable student IDs (e.g., SCH2026-0001)
- **Class Code System**: Auto-generated 6-character codes with expiration
- **Real-time Dashboard**: Live attendance tracking for teachers
- **Auto-Absent Marking**: Cron job automatically marks absent students
- **Analytics**: Attendance trends and exportable reports
- **Secure**: JWT authentication, rate limiting, input validation

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Helmet + CORS
- Joi validation

### Frontend
- React 18 + Vite
- TailwindCSS
- Framer Motion
- React Router
- React Query
- Axios

## Project Structure

```
school-attendance/
├── backend/
│   ├── src/
│   │   ├── config/          # Database config
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/      # Auth & validation
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── cron/            # Cron jobs
│   │   ├── utils/           # Utilities
│   │   └── index.js         # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   └── main.jsx        # Entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+
- npm or yarn

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration

npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/school_attendance
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
ATTENDANCE_CODE_LENGTH=6
ATTENDANCE_CODE_EXPIRE_MINUTES=10
PRESENT_MINUTES=5
LATE_MINUTES=10
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Classes
- `GET /api/classes` - List classes
- `POST /api/classes` - Create class
- `GET /api/classes/:id` - Get class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Students
- `GET /api/students` - List students
- `POST /api/students` - Create student
- `POST /api/students/bulk` - Bulk create students

### Attendance
- `POST /api/attendance/sessions` - Start session
- `PUT /api/attendance/sessions/:id/end` - End session
- `POST /api/attendance/checkin` - Student check-in
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/stats/:classId` - Get statistics

### Admin
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/teachers` - List teachers
- `POST /api/admin/teachers` - Create teacher

## Attendance Flow

1. **Teacher** creates a class with geolocation coordinates
2. **Teacher** starts an attendance session (generates 6-char code)
3. **Student** opens check-in page, enters UID + class code
4. **System** validates:
   - UID exists and belongs to the class
   - Class code is active and not expired
   - Student is within allowed radius (e.g., 200m)
   - Attendance not already marked for today
5. **System** records attendance with status (present/late), timestamp, coordinates, IP

## Security Features

- JWT authentication for admin/teacher routes
- Rate limiting on API endpoints
- Input validation with Joi
- Helmet for security headers
- CORS configuration
- Geolocation boundary validation
- Duplicate attendance prevention

## Deployment

### Production Build

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start backend
pm2 start backend/src/index.js --name attendance-api

# Start frontend
cd frontend && pm2 serve dist --name attendance-web --spa
```

### Docker (Optional)

Create `Dockerfile` for backend:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "src/index.js"]
```

## License

MIT
