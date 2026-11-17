
# Growth Tech India - User Management System

A full-stack User Management System built using React.js, Node.js, Express.js, and MongoDB.

## Features

### Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes
- Role-based access control
- Logout functionality
- Form validation

### Admin Dashboard
- Admin login
- Dashboard statistics
- Total users
- Active users
- Inactive users
- Total administrators

### User Management
- View all registered users
- Search users by name, email, role, or status
- Create new user accounts
- Update user information
- Change user roles
- Activate and deactivate accounts
- Delete users with confirmation
- Prevent administrators from modifying or deleting their own access

## Technology Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Lucide React
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- CORS

## Project Structure

```text
Growth-tech-project/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── seedAdmin.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd Growth-tech-project
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the server folder using `.env.example` as a reference.

Configure your MongoDB connection string, JWT secret, and admin credentials.

### 3. Create Admin Account

```bash
node seedAdmin.js
```

### 4. Start Backend Server

```bash
npm run dev
```

Backend runs at:

http://localhost:5000

### 5. Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

http://localhost:5173

## API Documentation

Base URL:

`http://localhost:5000/api`

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register a user |
| POST | /auth/login | Login user or admin |

### User Management APIs

All user management endpoints require a valid Admin Bearer Token.

| Method | Endpoint | Description |
|---|---|---|
| GET | /users | Get all users |
| GET | /users/stats | Get dashboard statistics |
| PUT | /users/:id | Update user details |
| DELETE | /users/:id | Delete a user |

### Authentication Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Database Structure

### User Collection

| Field | Type | Description |
|---|---|---|
| name | String | User's full name |
| email | String | Unique email address |
| password | String | Hashed password |
| role | String | user or admin |
| status | String | active or inactive |
| createdAt | Date | Account creation date |
| updatedAt | Date | Last update date |

## Security

- Passwords are hashed using bcryptjs.
- JWT tokens protect private API routes.
- Role-based middleware restricts admin functionality.
- Input validation prevents invalid updates.
- Administrators cannot delete their own accounts.
- Administrators cannot remove or deactivate their own access.
- Environment variables are excluded from Git.

## Testing

The following functionalities were tested:

- User registration
- User login
- Admin login
- Dashboard statistics
- Fetching all users
- Updating user details
- Changing user status
- Deleting users
- Admin authorization
- Self-deactivation protection
- Self-role-change protection

API testing was performed using Thunder Client.

## Future Improvements

- Pagination for user records
- Forgot password functionality
- Email notifications
- Advanced dashboard analytics
- User profile management

## Developer

Developed as a full-stack development project for Growth Tech India.

**Technologies:** React.js | Node.js | Express.js | MongoDB
