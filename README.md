# Smart Printer System

A full-stack system for managing printers, printing jobs, inventory, employees, attendance, waste reports, and financial tracking.

## Project Structure

- `client/` → React frontend
- `server/` → Express backend

## Tech Stack

- Frontend: React, React Router, Bootstrap, Axios
- Backend: Node.js, Express, MongoDB, JWT, EJS

## Prerequisites

- Node.js installed
- npm or yarn
- MongoDB running locally or a MongoDB connection string

## Environment Variables

Create a `.env` file inside the `server` folder with variables like:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Installation

### 1) Install backend dependencies

```bash
cd server
npm install
```

### 2) Install frontend dependencies

```bash
cd ../client
npm install
```

## Run the Project

### Start the backend

```bash
cd server
npm run dev
```

The server will run on:
- http://localhost:3001

### Start the frontend

```bash
cd client
npm start
```

The frontend will run on:
- http://localhost:3000

## Notes

- The frontend expects the backend API on `http://localhost:3001`
- Make sure MongoDB is running before starting the backend
- For production deployment, update the frontend API base URL if needed

## Useful Commands

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm start
```
