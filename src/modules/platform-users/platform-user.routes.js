import { Router } from 'express';

import { createPlatformUserController } from './platform-user.controller.js';

const router = Router();

router.post('/', createPlatformUserController);

export default router;
