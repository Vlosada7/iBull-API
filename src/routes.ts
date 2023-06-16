import { Router } from 'express';
import * as tradeController from './Controllers/tradeControllers';

const router = Router();

router.post('/trades', tradeController.postTrade);
router.get('/trades', tradeController.getTrade);
router.get('/trades/:id', tradeController.getTradeById);
router.delete('/trades/:id',tradeController.deleteTrade);

export default router;