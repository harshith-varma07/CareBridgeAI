# Deployment Guide

## Local
1. Start services with `docker compose up --build`
2. Backend API: `http://localhost:5000`
3. AI service: `http://localhost:8000`
4. MongoDB: `mongodb://localhost:27017/carebridge`

## Production Notes
- Use managed MongoDB (Atlas)
- Store secrets in vault/CI secret manager
- Configure HTTPS + JWT secret rotation
- Use Cloudinary for persistent wound image storage
- Add Firebase Cloud Messaging credentials for notifications
