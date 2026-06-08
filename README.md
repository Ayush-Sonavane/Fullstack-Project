# StoreRate — Store Rating Platform

A fullstack web application where users submit ratings (1–5) for stores registered on the platform. Features role-based access for System Administrators, Normal Users, and Store Owners.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | Express.js, Sequelize ORM, JWT Auth     |
| Database | MySQL                                   |
| Frontend | React (Vite), Tailwind CSS              |

## Features

### System Administrator
- Dashboard with total users, stores, and ratings stats
- Add new users (admin, normal user, store owner)
- Add new stores and assign owners
- View/filter/sort user and store lists
- View user details (including store owner ratings)

### Normal User
- Self-registration and login
- Browse and search stores by name/address
- Submit and modify ratings (1–5 stars)
- Change password

### Store Owner
- Dashboard showing average rating and list of raters
- Change password

## Getting Started

### Prerequisites
- **Node.js** v18+
- **MySQL** installed and running
- **npm** (comes with Node.js)

### 1. Set Up MySQL

Create the database:
```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend Setup

```bash
cd server
npm install
```

Update the `.env` file with your MySQL credentials:
```
DB_PASSWORD=your_mysql_password
```

Seed the admin user:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

The server runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The client runs on **http://localhost:5173**

### Default Admin Credentials
- **Email:** admin@storerating.com
- **Password:** Admin@1234

## Project Structure

```
Fullstack-Project/
├── server/
│   ├── src/
│   │   ├── config/        # Database & JWT configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/     # Auth & role guards, error handler
│   │   ├── models/        # Sequelize models (User, Store, Rating)
│   │   ├── routes/        # Express route definitions
│   │   ├── seeders/       # Admin seed script
│   │   └── validators/    # Input validation rules
│   ├── server.js          # Entry point
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/    # Reusable UI (DataTable, StarRating, SearchBar)
│   │   ├── context/       # AuthContext (JWT state management)
│   │   ├── layouts/       # DashboardLayout with sidebar
│   │   ├── pages/         # Route-level pages (admin, user, owner)
│   │   ├── services/      # Axios API client
│   │   └── utils/         # Validators
│   └── package.json
│
└── README.md
```

## Form Validations
| Field    | Rule                                                         |
|----------|--------------------------------------------------------------|
| Name     | Min 20 characters, Max 60 characters                         |
| Email    | Standard email validation                                    |
| Password | 8–16 characters, 1 uppercase letter, 1 special character     |
| Address  | Max 400 characters                                           |

## API Endpoints

| Method | Endpoint                    | Access         | Description              |
|--------|-----------------------------|----------------|--------------------------|
| POST   | `/api/auth/register`        | Public         | User registration        |
| POST   | `/api/auth/login`           | Public         | Login                    |
| GET    | `/api/auth/me`              | Authenticated  | Current user info        |
| GET    | `/api/users`                | Admin          | List users               |
| GET    | `/api/users/:id`            | Admin          | User details             |
| POST   | `/api/users`                | Admin          | Create user              |
| PUT    | `/api/users/password`       | Authenticated  | Update password          |
| GET    | `/api/users/dashboard/stats`| Admin          | Dashboard stats          |
| GET    | `/api/stores`               | Authenticated  | List stores              |
| GET    | `/api/stores/:id`           | Authenticated  | Store details            |
| POST   | `/api/stores`               | Admin          | Create store             |
| GET    | `/api/stores/owner/dashboard`| Store Owner   | Owner dashboard          |
| POST   | `/api/ratings`              | User           | Submit rating            |
| PUT    | `/api/ratings/:id`          | User           | Update rating            |
