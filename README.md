# Project Title
CartEngine

## Project Description
CartEngine is a backend service designed to manage shopping cart functionalities for e-commerce platforms. Built with Typescript, Node.js and Express, it leverages Prisma ORM for railway database interactions, providing a scalable and efficient solution for cart management.


<!-- ## Features
- User Management: Handle user registration, authentication, and profile management.

- Product Catalog: Manage product listings, categories, and details.

- Shopping Cart: Add, update, and remove items from the cart.

- Order Processing: Create and manage orders based on cart contents.

- Database Integration: Utilize Prisma for seamless database operations. -->

## 🚀 Features

- 🛡 **Arcjet** integration for bot mitigation and route protection
- ✅ Custom error middleware for centralized error handling
- 🛒 Full cart lifecycle (add, update, remove items)
- 👤 User authentication & session handling (JWT or session-based)
- 📦 Product catalog management
- 🧪 Modular code structure using service/controller pattern
- 🔐 Environment-based config loading
- 🔁 Request validation using middleware

---

## 🧰 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **Arcjet**
- **PostgreSQL**
- **Zod** for validation
- **Swagger** (optional for API docs)

---

## 📁 Project Structure
src/
├── config/ # Environment & database setup
├── controllers/ # Route logic
├── middlewares/ # Custom middleware (e.g., error handling, Arcjet)
├── models/ # Database models/schemas
├── routes/ # Express routers
└── index.ts # App entry point
---

## 🔐 Setup & Environment

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
ARCJET_SECRET=your_arcjet_secret


## 🧱 Custom Middleware
The app uses a central error handler to ensure consistent error messages and proper HTTP status codes. Errors are wrapped in custom classes (e.g., AppError) and handled in one place.

## 🛡 Arcjet Integration
CartEngine leverages Arcjet for:

Blocking bots and scrapers

Protecting sensitive endpoints

Enhancing rate-limiting and abuse prevention

See arcjet for configuration details.