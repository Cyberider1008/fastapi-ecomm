# E-Com Web Application (FastAPI + React)

## Backend
- Location: `backend`
- Run API:
```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend
- Location: `frontend`
- Dev server:
```bash
cd frontend
npm install
npm run dev
```

## Features
- Admin/User login (JWT) with active/inactive enforcement
- User registration with Name, Address, Email, Contact, DOB, Profile Photo upload
- User Dashboard: profile and status display
- Admin Dashboard: table of users, toggle Active/Inactive

## Creating an Admin User

You can create an admin user in three ways:

### Method 1: Using Environment Variables (Recommended for Production)
Set the following environment variables before starting the server:
```bash
# Windows PowerShell
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="your-secure-password"

# Windows CMD
set ADMIN_EMAIL=admin@example.com
set ADMIN_PASSWORD=your-secure-password

# Linux/Mac
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="your-secure-password"
```

The admin user will be automatically created when the server starts.

### Method 2: Using the Create Admin Script
Run the provided script:
```bash
python backend/create_admin.py <email> <password> [name]
```

Example:
```bash
python backend/create_admin.py admin@example.com secret123 "Admin User"
```

### Method 3: Upgrade Existing User to Admin
If you already have a regular user, you can upgrade them to admin by running:
```bash
python backend/create_admin.py <existing-email> <their-password>
```

The script will detect the existing user and upgrade them to admin.

