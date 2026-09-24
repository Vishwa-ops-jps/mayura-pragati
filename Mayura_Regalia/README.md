# MAYURA REGALIA - Jewellery E-Commerce MVP

MAYURA REGALIA is a React.js + Express.js + MySQL jewellery e-commerce MVP with a separate admin panel.

## Project Structure

```text
MAYURA-REGALIA/
├── frontend/                 # React storefront + admin UI
│   ├── public/products/      # Jewellery images
│   └── src/
│       ├── admin/            # Admin login + dashboard
│       ├── components/       # Storefront components
│       ├── pages/            # Storefront pages
│       ├── services/         # API/auth/product services
│       └── ...
└── backend/                  # Express API
    ├── config/              # MySQL connection
    ├── controllers/         # Auth/product logic
    ├── middleware/          # JWT admin protection
    ├── models/              # MySQL queries
    ├── routes/              # REST routes
    └── utils/               # Seed helpers
```

## Run the project

### 1. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set your MySQL credentials.

```bash
npm start
```

The backend creates the `mayura_regalia` database/tables and seeds the initial catalogue if required.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm start
```

The storefront runs on `http://localhost:3000` and the API runs on `http://localhost:5000`.

## Admin Panel

Open:

`http://localhost:3000/admin/login`

The credentials come from `backend/.env`:

```env
ADMIN_EMAIL=admin@mayuraregalia.com
ADMIN_PASSWORD=Admin@123
```

After login, the admin dashboard can add, edit and delete products. These changes are saved in MySQL and immediately become available to the React storefront through `/api/products`.

## Database

The backend uses MySQL database `mayura_regalia` and automatically creates:

- `admins`
- `products`

Do not commit `.env` to source control. Change the default admin password and JWT secret before deployment.

## Deploy to Railway

This repository is set up to deploy as **one Railway web service** plus a
**Railway MySQL service**. The Express server serves the compiled React app,
including `/admin`, and the API remains available under `/api`.

1. Push this repository to GitHub (the existing `origin` remote can be used).
2. In Railway, create a project and add a **MySQL** service.
3. Add a service from the GitHub repository. In its source settings, set the
   root directory to `Mayura_Regalia`. Railway will use the included
   `Dockerfile` and `railway.toml`.
4. In the web service's Variables tab, add references to the MySQL service:

   ```env
   MYSQLHOST=${{MySQL.MYSQLHOST}}
   MYSQLPORT=${{MySQL.MYSQLPORT}}
   MYSQLUSER=${{MySQL.MYSQLUSER}}
   MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}
   MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
   DB_SSL=false
   ```

   Replace `MySQL` with the database service name if you rename it. Also set
   `JWT_SECRET` to a long random value, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
   Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and SMS variables only when
   those production integrations are being used.
5. Generate a public domain for the web service. Set `FRONTEND_URL` to that
   exact `https://...` domain and redeploy.

The application creates its tables and seed data automatically on its first
successful connection to MySQL. Confirm the deployment by opening
`https://<your-domain>/api/health`, then visit the site and `/admin/login`.
