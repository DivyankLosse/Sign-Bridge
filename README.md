# Sign Bridge

Sign Bridge is an ASL-first translation platform with a React + Vite frontend, FastAPI backend, and MongoDB persistence.

## Stack

- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: FastAPI
- Database: MongoDB
- AI: MediaPipe + TensorFlow assets for ASL recognition

## Core Features

- Auth with persistent login
- Live ASL sign-to-text translator
- Text-to-sign animation playback
- History with filtering by translation type
- Dashboard with recent activity and user stats
- Support form backed by MongoDB

## Project Structure

```text
Sign-Bridge/
├── backend/
│   ├── app/
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── history.py
│   │   ├── support.py
│   │   ├── translate.py
│   │   └── user.py
│   ├── static/animations/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## Local Development

### Backend

```powershell
cd backend
.\venv\Scripts\Activate
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment

Backend expects:

- `MONGO_URI` or `MONGODB_URI`
- `SECRET_KEY` or `JWT_SECRET`

Frontend can use:

- `VITE_API_BASE_URL`
- `VITE_WS_URL` (optional)

## API Overview

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `POST /asl/predict`
- `POST /translate/text`
- `GET /history`
- `POST /history`
- `GET /user/stats`
- `POST /support`

## Notes

- MongoDB is the only supported database for this app.
- Static sign animations are served from `backend/static/animations`.
- Frontend requests are centralized through `frontend/src/services/api.js`.
