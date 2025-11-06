# E-Com Web Application (FastAPI + React)

## Backend
- Location: `backend`
- Run API:
```bash
uvicorn backend.app.main:app --reload 
```

## Frontend
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

### Method 1: Using the Create Admin Script
Run the provided script:
```bash
python backend/create_admin.py <email> <password> [name]
```

Example:
```bash
python backend/create_admin.py admin@gmail.com admin123 "Admin User"
```

### Method 2: Upgrade Existing User to Admin
If you already have a regular user, you can upgrade them to admin by running:
```bash
python backend/create_admin.py <existing-email> <their-password>
```

The script will detect the existing user and upgrade them to admin.

