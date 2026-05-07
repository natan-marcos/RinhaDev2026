import { Router, Request, Response } from 'express';
import { vectorSearch } from './vectorSearch';
import { FraudRequest } from './Models/Request';

const router = Router();

router.get('/ready', (_req: Request, res: Response) => {
  res.status(200).json({ ready: true });
});

router.post('/fraud-score', async (req: Request<{}, {}, FraudRequest>, res: Response) => {
  try {
    const payload = req.body;
    const result = await vectorSearch(payload);
    res.status(200).json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(500).json({ error: message });
  }
});

export default router;