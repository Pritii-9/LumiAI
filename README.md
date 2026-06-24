# LumiAI — AI Interview Prep Platform

> Practice smarter. Get real AI feedback. Land the job.

LumiAI is a full-stack AI-powered interview preparation platform. Paste any job description, take an AI-guided interview session, and receive instant, detailed feedback on your technical depth and communication — all in one clean workspace.

---

## ✨ Features

- 🤖 **AI Question Generation** — Role-specific questions generated from any job description using Groq LLM
- 🎙️ **AI-Guided Sessions** — Answer questions at your own pace with real-time AI prompts
- 📊 **Instant Feedback** — Automatic scoring on technical depth, communication clarity, and improvement areas
- 🔐 **Secure Auth** — Full JWT-based signup/login with OTP email verification
- 🌙 **Dark Mode** — Full dark/light theme support across every page
- 📱 **Responsive** — Mobile-first layout with collapsible sidebar and hamburger menu

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | React Router v6 |
| Icons | Lucide React |
| Toasts | Sonner |
| Backend | Express.js + TypeScript |
| Database | MongoDB Atlas via Mongoose |
| Auth | JWT + bcryptjs |
| Email (OTP) | Nodemailer (Gmail SMTP) |
| AI | Groq API (with fallback generator) |
| Dev | ts-node + nodemon |

---

## 📁 Project Structure

```
LumiAI/
├── frontend/                        # Vite + React + TypeScript
│   └── src/
│       ├── components/
│       │   ├── create-interview/    # Form, question list, interview link
│       │   └── dashboard/          # Cards, welcome header, interview list
│       ├── context/                 # UserContext, InterviewDataContext
│       ├── hooks/                   # useInterviewList
│       ├── layouts/                 # DashboardLayout (responsive sidebar)
│       ├── lib/                     # Utility functions & nav constants
│       ├── pages/
│       │   ├── LandingPage.tsx      # Premium SaaS landing page
│       │   ├── AuthPage.tsx         # Sign in / Sign up / OTP verification
│       │   ├── dashboard/           # Main dashboard & create interview flow
│       │   ├── interview/           # Join, start, and complete interview pages
│       │   ├── scheduled/           # Interview details & candidate view
│       │   ├── AllInterviewPage.tsx
│       │   ├── ScheduledInterviewPage.tsx
│       │   ├── SettingsPage.tsx
│       │   └── BillingPage.tsx
│       └── types/                   # Shared TypeScript interfaces
│
└── backend/                         # Express + Mongoose + TypeScript
    └── src/
        ├── config/
        │   └── db.ts                # MongoDB connection
        ├── controllers/
        │   ├── authController.ts    # Register, login, OTP send/verify
        │   ├── interviewController.ts
        │   ├── feedbackController.ts
        │   └── aiController.ts
        ├── models/
        │   ├── User.ts              # User schema (bcrypt hashed password)
        │   ├── OTP.ts               # OTP schema (5 min TTL expiry)
        │   └── Interview.ts
        ├── routes/
        │   ├── authRoutes.ts
        │   ├── interviewRoutes.ts
        │   ├── feedbackRoutes.ts
        │   └── aiRoutes.ts
        ├── utils/
        │   ├── sendEmail.ts         # Nodemailer email sender
        │   ├── constants.ts         # AI prompts
        │   └── aiFallback.ts        # Fallback question generator
        └── server.ts                # Express app entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key → [console.groq.com](https://console.groq.com)

### 1. Clone the repo

```bash
git clone https://github.com/Pritii-9/LumiAI.git
cd LumiAI
```

### 2. Set up the Backend

```bash
cd backend
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# Optional: for real OTP emails
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
```

```bash
npm install
npm run dev   # → http://localhost:5000
```

### 3. Set up the Frontend

```bash
cd frontend
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_GROQ_API_KEY=your_groq_api_key
```

```bash
npm install
npm run dev   # → http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/register` | Register user (verifies OTP) |
| POST | `/api/auth/login` | Login with email & password |
| GET | `/api/auth/me` | Get logged-in user profile |

### Interviews & AI
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/interviews?userEmail=&limit=` | List user interviews |
| GET | `/api/interviews/:id` | Get interview by ID |
| POST | `/api/interviews` | Create new interview |
| POST | `/api/feedback` | Save candidate feedback |
| POST | `/api/ai/generate-questions` | Generate AI questions from job brief |
| POST | `/api/ai/generate-feedback` | Generate AI feedback from transcript |
| GET | `/api/health` | Health check |

---

## 📧 OTP Email Setup

LumiAI uses Gmail SMTP for sending OTP verification emails. To enable it:

1. Enable **2-Step Verification** on your Google Account
2. Go to **Security → App Passwords** and generate a 16-character password
3. Add `EMAIL_USER` and `EMAIL_PASS` to your backend `.env`

> Without email credentials, the OTP code is printed to the backend terminal (development mode).

---

## 📸 Screenshots

| Landing Page | Dashboard | Create Interview |
|:---:|:---:|:---:|
| Premium dark SaaS UI | AI session overview | Job description → AI questions |

---

## 📄 License

MIT — feel free to use, fork, and build on top of this project.
