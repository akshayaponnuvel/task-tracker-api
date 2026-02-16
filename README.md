# Task Tracker API

A scalable RESTful Task Management API built using **Node.js, Express, TypeScript, MongoDB, and Redis**.

This project includes authentication, task CRUD operations, Redis caching, and automated testing with Jest.

---

## Features

* User Authentication (JWT)
* Task CRUD Operations
* Redis Caching for performance
* Cache Invalidation on updates
* MongoDB Integration with Mongoose
* Unit & Integration Testing (Jest)
* In-memory MongoDB & Redis mocking for tests
* Environment-based configuration
* Clean architecture with separation of concerns

---

## Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB + Mongoose
* Redis
* JWT Authentication
* Jest + Supertest
* mongodb-memory-server
* redis-mock

---

## Installation

### 1. Clone Repository

```
git clone https://github.com/your-username/task-tracker.git
cd task-tracker
```

### 2. Install Dependencies

```
npm install
```

### 3. Environment Variables

Create `.env` file in root:

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=your_secret_key
REDIS_URL=redis://localhost:6379
```

---

## Running the Application

### Development

```
npm run dev
```

### Production Build

```
npm run build
npm start
```

---

## Running Tests

```
npm test
```

### Coverage Report

```
npm run test:coverage
```

Coverage target: **70%+**

---

##  Authentication APIs

### Register User

```
POST /api/auth/signup
```

Body:

```
{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login User

```
POST /api/auth/login
```

---

## Task APIs (Protected)

Add Header:

```
Authorization: Bearer <token>
```

### Create Task

```
POST /api/tasks
```

### Get Tasks

```
GET /api/tasks
```

Cached per user using Redis.

### Update Task

```
PUT /api/tasks/:id
```

### Delete Task

```
DELETE /api/tasks/:id
```

Cache invalidates automatically when tasks change.

---

## ⚡ Redis Caching Strategy

* Cache key: `tasks:<userId>`
* Cache applied on:

  * `GET /api/tasks`
* Cache invalidated on:

  * Create Task
  * Update Task
  * Delete Task

---

## Testing Strategy

* Jest + Supertest
* Integration testing with MongoDB Memory Server
* Redis mocked using redis-mock
* Authentication and Task APIs tested

---

## Future Improvements

* Swagger API documentation
* Role-based access control
* Pagination
* Docker deployment

---

## Author

Akshaya
