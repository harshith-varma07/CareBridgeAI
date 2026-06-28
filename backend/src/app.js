import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { apiRouter } from './routes/index.js';
import { swaggerSpec } from './swagger.js';

dotenv.config();
export const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', apiRouter);

app.use((error, _req, res, _next) => {
  return res.status(500).json({ message: error.message || 'Internal server error' });
});
