# CareBridge AI

CareBridge AI is a modular postoperative recovery platform for early Surgical Site Infection (SSI) risk triage.

## Tech Stack
- **Mobile:** React Native (Expo) + TypeScript + Redux Toolkit + React Navigation + React Native Paper
- **Backend:** Node.js + Express + MongoDB + Mongoose + JWT + Multer + Swagger
- **AI Service:** FastAPI + OpenCV + Pillow + NumPy + Pandas + scikit-learn
- **Notifications:** Firebase Cloud Messaging (integration hook points documented)

## Repository Structure
- `/mobile` – Expo app with patient and doctor flows
- `/backend` – REST API and persistence layer
- `/ai-service` – AI inference + training pipeline
- `/docs` – architecture, schema, deployment docs

## Implemented Phases
### Phase 1: Project setup and architecture
- Monorepo layout and modular service boundaries
- Docker Compose orchestration for MongoDB + backend + AI service

### Phase 2: Authentication and database
- JWT auth endpoints: `POST /api/auth/register`, `POST /api/auth/login`
- MongoDB models: Users, Patients, DailyResponses, RiskReports, Notifications, ClinicalNotes

### Phase 3: Patient mobile app
- Login, patient dashboard, daily chat assessment, history, notifications, profile screens
- Conversational assessment UI for pain, fever, redness, discharge, and image upload CTA

### Phase 4: Doctor dashboard
- Doctor dashboard with patient risk cards, critical-first view, alerts summary

### Phase 5: AI microservice
- `POST /ai/analyze` endpoint in FastAPI
- Image feature extraction, trend detection, hybrid risk scoring, explainable recommendation

### Phase 6: AI training pipeline
- `ai-service/training/scripts/train.py` with synthetic dataset loader
- Evaluation metrics: accuracy, precision, recall, F1, confusion matrix

### Phase 7: Integration
- Backend delegates AI inference to FastAPI via `AI_SERVICE_URL`
- Backend fallback risk engine for local resilience when AI service is unavailable

### Phase 8: Testing and documentation
- Backend unit tests for hybrid risk engine
- AI API test for response shape and value ranges
- Architecture, schema, deployment documentation in `/docs`

## API Endpoints
### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Patients
- `GET /api/patients`
- `GET /api/patients/:id`
- `POST /api/patients`
- `PUT /api/patients/:id`

### Daily Responses
- `POST /api/responses`
- `GET /api/responses/:patientId`

### AI
- `POST /api/ai/analyze`

### Reports
- `GET /api/reports/:patientId`

### Notifications
- `GET /api/notifications`

## Run Locally
### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker (optional, recommended)

### Option A: Docker Compose
```bash
docker compose up --build
```

### Option B: Manual
```bash
# backend
cd backend
npm install
npm start

# ai service
cd ../ai-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# mobile
cd ../mobile
npm install
npm start
```

## Environment Variables
### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/carebridge
JWT_SECRET=change-me
AI_SERVICE_URL=http://localhost:8000
```

## AI Response Contract
```json
{
  "infectionProbability": 0.83,
  "rednessScore": 0.74,
  "trend": "Increasing",
  "risk": "RED",
  "confidence": 0.92,
  "explanation": "Pain increased significantly over the past three days..."
}
```

## Notes
- This is a Clinical Decision Support workflow, not a diagnosis system.
- The Node backend never performs model inference directly; it calls the Python AI microservice.
