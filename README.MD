📘 Golf Charity Platform
A full-stack web application that allows users to participate in a golf-based scoring system, manage subscriptions, and compete in periodic draws. Admins can manage users and run draws to determine winners.
🚀 Live Demo
Frontend (User Dashboard):
https://golf-charity-black.vercel.app/dashboard⁠�
Admin Panel:
https://golf-charity-black.vercel.app/admin⁠�
🧠 Features
👤 User Features
User authentication (Signup/Login)
Add and manage scores (max 5 recent scores)
View score history
Subscription system (monthly/yearly)
Access restricted features based on subscription
🏆 Draw System
Admin can run a draw
Generates 5 random numbers (1–45)
Matches user scores against draw numbers
Winners categorized by:
🎯 3 matches → Tier 3
🥈 4 matches → Tier 2
🏆 5 matches → Jackpot
🛠 Admin Features
View all users
Run draw manually
View draw results and winners
Dashboard with system stats
🏗 Tech Stack
Frontend
React (Vite)
Tailwind CSS
React Router
Backend
Node.js
Express.js
MongoDB (Mongoose)
Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
🔐 Authentication
JWT-based authentication
Token stored in localStorage
Protected routes for users and admins
Backend supports both cookie and header-based auth
📂 Project Structure

frontend/
  src/
    pages/
    components/
    hooks/
    context/
    lib/

backend/
  models/
  controllers/
  routes/
  middleware/
⚙️ Setup Instructions
1️⃣ Clone Repository
Bash
git clone https://github.com/Mohammad-Aamir667/Golf-Charity.git
cd Golf-Charity
2️⃣ Backend Setup
Bash
cd backend
npm install
Create .env file:
Environment
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
Run:
Bash
npm run dev
3️⃣ Frontend Setup
Bash
cd frontend
npm install
Create .env:
Environment
VITE_API_URL=http://localhost:5000/api
Run:
Bash
npm run dev
📡 API Highlights
Auth
POST /auth/signup
POST /auth/login
Scores
POST /scores
GET /scores
Subscription
POST /subscription
GET /subscription
Admin
GET /admin/users
POST /admin/draw/run
GET /admin/draw/results
🧪 Testing
APIs tested using Postman
Manual testing for:
Auth flow
Score limit logic
Draw logic
Subscription behavior
⚡ Key Highlights
Clean separation of concerns (MVC structure)
Optimized score storage (max 5 entries)
Efficient draw matching logic
Role-based access control
Production-ready deployment
💡 Future Improvements
Payment integration (Stripe)
Real-time updates (WebSockets)
Notifications system
Better UI/UX enhancements
👨‍💻 Author
Mohammad Aamir
GitHub: https://github.com/Mohammad-Aamir667⁠�