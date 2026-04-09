# Sushrut Shastri Photography

Professional photography portfolio website for an Edmonton-based photographer.

## Live Website

- **Frontend:** [https://sushrut-shastri-photography.vercel.app]
- **Backend API:** [https://sushrut-photography-api.onrender.com]

## Features

-  Responsive photography portfolio gallery
-  Hidden admin panel for photo management
-  Category-based organization (Wedding, Portrait, Commercial, Family)
-  Client album system for specific clients
-  Parallax sections for visual impact
-  Contact form with email notifications
-  Cloudinary integration for image storage
-  MongoDB Atlas for database

## Tech Stack

- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary
- **Hosting:** Vercel (frontend), Render (backend)

## Local Development

### Prerequisites
- Node.js installed
- MongoDB running locally
- Cloudinary account

### Setup

1. Clone the repository
```bash
git clone https://github.com/twishashastri/sushrut-photography.git
cd sushrut-photography

2. Install backend dependencies
cd server
npm install

3. Install frontend dependencies
cd client
npm install

4. Create .env file
Environment Variables
Server (.env):

MONGODB_URI=mongodb://localhost:27017/sushrut-photography
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

Client (.env):
REACT_APP_API_URL=http://localhost:5000/api

5. Run development servers
# Backend
cd server
npm run dev

# Frontend
cd client
npm start

Admin Access
The admin panel is hidden at: /admin-ssp/login

Deployment
Frontend: Automatically deploys to Vercel on push to master

Backend: Automatically deploys to Render on push to master

Website: sushrut-shastri-photography.vercel.app

License
All rights reserved. © Sushrut Shastri Photography