import { Router } from 'express';
import { createAccount, getAccounts, transfer, deposit, withdraw, getTransactions } from '../controllers/bankController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/accounts', authenticateToken, createAccount);
router.get('/accounts', authenticateToken, getAccounts);
router.post('/transfer', authenticateToken, transfer);
router.post('/deposit', authenticateToken, deposit);
router.post('/withdraw', authenticateToken, withdraw);
router.get('/transactions', authenticateToken, getTransactions);

export default router;
