import { Router } from 'express';
import { getAllUsers, getAllTransactions, getSystemLogs, getUserAccounts, adjustBalance, updateAccountStatus, deleteUser, getAdminStats } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';

const router = Router();

// All routes here require valid token AND Admin role
router.get('/stats', authenticateToken, isAdmin, getAdminStats);
router.get('/users', authenticateToken, isAdmin, getAllUsers);
router.get('/users/:userId/accounts', authenticateToken, isAdmin, getUserAccounts);
router.delete('/users/:userId', authenticateToken, isAdmin, deleteUser);
router.get('/transactions', authenticateToken, isAdmin, getAllTransactions);
router.get('/logs', authenticateToken, isAdmin, getSystemLogs);
router.post('/adjust-balance', authenticateToken, isAdmin, adjustBalance);
router.post('/account-status', authenticateToken, isAdmin, updateAccountStatus);

export default router;
