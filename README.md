# Yarl Ventures - Member Management System

## Setup Steps

1. **Clone the repository:** (You would have already done this)
2. **Install dependencies:**
   - Server: `cd server` and `npm install`
   - Client: `cd client` and `npm install`
3. **Environment Variables:**
   - Copy `.env.example` to `.env` in the `server` directory and update variables if needed.
   - Example variables are provided below.
4. **Start the application:**
   - Start Server: `cd server` and `npm start` (or `npm run dev`)
   - Start Client: `cd client` and `npm run dev`
5. **Seed the database:**
   - Run `node seed.js` in the `server` folder.

## Seed Instructions & Chairman Login
Run `node seed.js` inside the `server` directory before starting the application. It will create the Chairman account and Membership Types.

**Chairman Credentials:**
- **Email:** chairman@.com
- **Password:** chairman123

## ✨ Features

- **User Authentication:** Secure Registration and Login using JWT.
- **Role-Based Access Control (RBAC):**
  - **CHAIRMAN:** Full system access. Can create custom Officer roles and assign them to users.
  - **OFFICER:** Has dynamic permissions (e.g., approve/reject applications) assigned by the Chairman.
  - **MEMBER:** Can submit membership applications and track their status.
- **Membership Application:** Apply for Individual or Company memberships with automated fee assignment.
- **Dynamic Role Management:** Chairman can dynamically create roles and assign specific permissions.
- **Audit Logs:** Track all the important actions happening in the system.

