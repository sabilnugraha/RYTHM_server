import { Router } from 'express';

import healthRoutes from './health.routes.js';
import platformUserRoutes from '../modules/platform-users/platform-user.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/platform-users', platformUserRoutes);

export default router;
