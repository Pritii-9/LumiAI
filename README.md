# AI Interview Prep — MERN Stack

**Vite + React + TypeScript + Tailwind CSS v4 + Express + MongoDB (Mongoose)**

---

## 📁 Folder Structure

```
ai-interview-prep-mern/
├── frontend/                  # Vite + React + TypeScript + Tailwind CSS v4
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── create-interview/
│   │   │   │   ├── FormContainer.tsx
│   │   │   │   ├── QuestionList.tsx
│   │   │   │   └── InterviewLink.tsx
│   │   │   └── dashboard/
│   │   │       ├── InterviewCard.tsx
│   │   │       ├── LatestInterviewList.tsx
│   │   │       └── WelcomeContainer.tsx
│   │   ├── context/           # React contexts
│   │   │   ├── UserContext.tsx
│   │   │   └── InterviewDataContext.tsx
│   │   ├── hooks/             # Custom hooks
│   │   │   └── useInterviewList.ts
│   │   ├── layouts/           # Page layouts
│   │   │   └── DashboardLayout.tsx
│   │   ├── lib/               # Utilities & constants
│   │   │   ├── utils.ts       # cn(), getInterviewUrl(), extractJsonPayload()...
│   │   │   └── constants.ts   # SideBarOptions navigation config
│   │   ├── pages/             # Route pages
│   │   │   ├── LandingPage.tsx
│   │   │   ├── AuthPage.tsx
│   │   │   ├── AllInterviewPage.tsx
│   │   │   ├── BillingPage.tsx
│   │   │   ├── ScheduledInterviewPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   └── CreateInterviewPage.tsx
│   │   │   ├── interview/
│   │   │   │   ├── InterviewJoinPage.tsx
│   │   │   │   ├── InterviewStartPage.tsx
│   │   │   │   └── InterviewCompletedPage.tsx
│   │   │   └── scheduled/
│   │   │       └── InterviewDetailsPage.tsx
│   │   ├── types/             # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── App.tsx            # React Router v6 routes
│   │   ├── main.tsx
│   │   └── index.css          # Tailwind v4 @theme tokens
│   ├── .env
│   ├── vite.config.ts         # Vite + @tailwindcss/vite + path alias + proxy
│   └── tsconfig.app.json
│
└── backend/                   # Express + Mongoose + TypeScript
    ├── src/
    │   ├── config/
    │   │   └── db.ts          # Mongoose connection
    │   ├── controllers/
    │   │   ├── interviewController.ts
    │   │   ├── feedbackController.ts
    │   │   └── aiController.ts
    │   ├── models/
    │   │   └── Interview.ts   # Mongoose model with TypeScript interfaces
    │   ├── routes/
    │   │   ├── interviewRoutes.ts
    │   │   ├── feedbackRoutes.ts
    │   │   └── aiRoutes.ts
    │   ├── utils/
    │   │   ├── constants.ts   # AI prompts
    │   │   └── aiFallback.ts  # Fallback question generator
    │   └── server.ts          # Express app entry point
    ├── .env
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Backend
```bash
cd backend
# Edit .env with your MONGODB_URI and OPENROUTER_API_KEY
npm run dev    # → http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
# Edit .env if needed (defaults to localhost:5000 proxy)
npm run dev    # → http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/interviews?userEmail=&limit=` | List user interviews |
| GET | `/api/interviews/:interview_id` | Get interview by ID |
| POST | `/api/interviews` | Create new interview |
| POST | `/api/feedback` | Save candidate feedback |
| POST | `/api/ai/generate-questions` | Generate AI interview questions |
| POST | `/api/ai/generate-feedback` | Generate AI feedback from transcript |
| GET | `/api/health` | Health check |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Toast | Sonner |
| Backend | Express.js + TypeScript |
| Database | MongoDB Atlas via Mongoose |
| AI | OpenRouter API (with fallback) |
| Dev | ts-node + nodemon |

---

## 🔑 Key Migration Changes

| Before (Next.js) | After (MERN) |
|-----------------|--------------|
| `next-auth` Google OAuth | Simple localStorage-based session (extend with JWT/Google OAuth) |
| Next.js API routes (`/app/api/`) | Express routes (`/api/`) |
| `NextResponse` | `res.json()` |
| `@/server/mongoClient.js` (raw driver) | Mongoose ODM with schema validation |
| `useRouter` from next/navigation | `useNavigate` from react-router-dom |
| `Link` from next/link | `Link` from react-router-dom |
| `Image` from next/image | `<img>` tags |
| `useParams` from next/navigation | `useParams` from react-router-dom |
| Tailwind via `postcss.config.mjs` | Tailwind v4 via `@tailwindcss/vite` plugin |
# LumiAI
