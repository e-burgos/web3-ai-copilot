import { Router } from 'express';
import { aiController } from '../controllers/aiController';

export const chatRoutes = Router();

chatRoutes.post('/', async (req, res, next) => {
  try {
    const { messages, provider } = req.body;
    const response = await aiController.chat(messages, provider);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

