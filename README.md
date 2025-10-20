# Node.js Session-Based Authentication Demo

A simple Node.js project demonstrating **session-cookie based authentication** using **Express**, **EJS**, and **MongoDB**.  
This project includes a complete flow: **register → login → protected dashboard → logout**, and uses `express-session` with `connect-mongodb-session` for persistent sessions.  

It is designed as a learning/demo project to understand how session-based authentication works in Node.js.

---

## Table of Contents
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Prerequisites](#prerequisites)  
- [Installation & Setup](#installation--setup)  
- [Project Structure](#project-structure)  
- [Available Routes](#available-routes)  
- [How Sessions Work](#how-sessions-work)  
- [Troubleshooting](#troubleshooting)  
- [Security Notes](#security-notes)  
- [License](#license)

---

## Features
- User registration with **name, email, and password** (passwords hashed with `bcrypt`)  
- Login with email + password  
- **Session-based authentication** using `express-session`  
- Sessions stored in **MongoDB** using `connect-mongodb-session`  
- Protected **dashboard** route accessible only by logged-in users  
- Logout destroys session and clears cookie  
- Flash/error messages on login/register forms  
- Simple **EJS templates** for views  

---

## Tech Stack
- Node.js  
- Express.js  
- EJS (templating)  
- MongoDB + Mongoose  
- express-session  
- connect-mongodb-session  
- bcrypt  

---

## Prerequisites
- Git  
- Node.js (v14+)  
- npm (or yarn)  
- MongoDB installed locally or MongoDB Atlas  

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
2. Install dependencies
bash
Copy code
npm install
3. Create .env file
Create a .env in the project root:

ini
Copy code
PORT=5000
MONGO_URI=mongodb://localhost:27017/sessions
SESSION_SECRET=your_super_secret_key
Make sure .env is in .gitignore.

4. Start MongoDB
For local MongoDB:

bash
Copy code
# Linux/macOS
sudo service mongod start

# Or start manually
mongod --dbpath /path/to/db --port 27017
5. Start the app
bash
Copy code
npm start
Visit http://localhost:5000 in your browser.

Project Structure
pgsql
Copy code
.
├── package.json
├── server.js (or app.js)
├── .env
├── models/
│   └── User.js
├── views/
│   ├── landing.ejs
│   ├── register.ejs
│   ├── login.ejs
│   └── dashboard.ejs
├── public/ (optional static files)
└── README.md
Available Routes
Route	Method	Description
/	GET	Landing page
/register	GET/POST	Register user
/login	GET/POST	Login user
/dashboard	GET	Protected dashboard
/logout	POST	Logout user and destroy session

How Sessions Work
On successful login, req.session.isAuth and req.session.userName are set.

express-session generates a session ID and stores the session in MongoDB.

Browser receives a cookie (connect.sid) with the session ID.

On future requests, the cookie is sent to the server, middleware loads session from MongoDB.

Protected routes check req.session.isAuth to allow or deny access.

Logout destroys the session in MongoDB and clears the cookie.

Troubleshooting
Cannot find module 'ejs' → npm install ejs

MongoDB connection errors → Ensure MongoDB is running and MONGO_URI is correct

Session not persisting → Verify connect-mongodb-session is saving sessions

Can't set headers after they are sent → Always return after res.render or res.redirect

Security Notes
Use HTTPS in production

Use a strong SESSION_SECRET

Set cookie options: httpOnly: true, secure: true, sameSite: 'lax'

Validate and sanitize user inputs

Rate-limit login routes to prevent brute-force attacks

License
MIT License
This project is free to use and modify for learning purposes.