import express from 'express';
import { authRequired } from '../middleware/auth.js';
import { analyzeWithAiService } from '../services/aiService.js';

export const aiRouter = express.Router();
aiRouter.use(authRequired);

aiRouter.post('/analyze', async (req, res) => {
  const analysis = await analyzeWithAiService(req.body);
  return res.json(analysis);
});
