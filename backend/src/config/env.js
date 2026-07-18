import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/carebridge',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
