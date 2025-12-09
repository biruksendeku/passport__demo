# passport__demo

A minimal authentication demo built with **Express 5**, **Passport.js** (local strategy), **MongoDB / Mongoose**, and **EJS** views.

## Features

- User registration with hashed passwords (bcryptjs)
- Local (email + password) login via Passport.js
- Session-based authentication with `express-session`
- Role-based access control (`regular` / `admin`) with protected routes
- Server-side input validation with `express-validator`

## Project Structure

```
app.js                        # Express app and routes
controllers/
  auth.js                     # isAuthenticated / isAdmin middlewares
  helper.js                   # bcrypt hash & compare helpers
  strategies/local.js         # Passport local strategy + serialization
models/
  user.js                     # Mongoose User model and DB connection
views/                        # EJS templates (signup, login, profile, admin)
public/css/                   # Stylesheets
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file (see `.env.example`):

   ```
   MONGODB_URI=<your-mongodb-connection-string>
   SESSION_SECRET_KEY=<a-random-secret>
   PORT=3000
   ```

3. Start the server:

   ```bash
   npm start       # production
   npm run dev     # watch mode
   ```

## Routes

| Method | Path       | Description                                  |
| ------ | ---------- | -------------------------------------------- |
| GET    | `/signup`  | Registration form                            |
| POST   | `/signup`  | Register a new user                          |
| GET    | `/login`   | Login form                                   |
| POST   | `/login`   | Authenticate with Passport local strategy    |
| GET    | `/profile` | Protected profile page (requires login)      |
| GET    | `/admin`   | Admin dashboard (requires `admin` role)      |
| GET    | `/logout`  | End the session                              |

## License

MIT
