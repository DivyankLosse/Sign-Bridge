# Production Validation Checklist: Sign Bridge Stable Rewrite

This document maps all critical features to their verification status for the stable production release (excluding the AI training pipeline).

## 1. System Core
- [ ] **Frontend Build**: `npm run build` succeeds without lint/type errors.
- [ ] **Backend Health**: `/health` endpoint returns `{"status": "ok"}`.
- [ ] **Infrastructure**: `render.yaml` environment variables match production requirements.

## 2. Authentication & DB
- [ ] **Signup**: New user registration creates document in MongoDB Atlas.
- [ ] **Login**: JWT token issued and stored in local storage.
- [ ] **Persistent Auth**: User remains logged in after page refresh.

## 3. Translator Stability (TFLite)
- [ ] **Model Initialization**: `loader_debug.txt` confirms TFLite model is used first.
- [ ] **Real-time Inference**: WebSocket receives predictions with <200ms latency.
- [ ] **Resource Usage**: Backend RAM usage remains <400MB on Render Free tier.
- [ ] **Frame Dropping**: Backend skips frames when processing to prevent buffer overflow.

## 4. Stability & Security
- [ ] **CORS**: Requests are only allowed from `FRONTEND_URL` and `localhost`.
- [ ] **AI Training Isolation**: `ai_training/` directory is ignored by git and build context.
- [ ] **Error Handling**: Missing model or camera access shows user-friendly alerts.

## 5. Verification Commands
- **Backend**: `uvicorn app.main:app --reload`
- **Frontend**: `cd frontend && npm run dev`
- **Build**: `cd frontend && npm run build`
