import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getUserForSidebar } from '../controllers/message.controller.js';
import { getMessage, sendMessage } from '../controllers/message.controller.js';
const router = express.Router();

router.get('/users',protectRoute, getUserForSidebar);
router.get('/:id',protectRoute,getMessage);
router.post('/send/:id',protectRoute,sendMessage);

export default router;