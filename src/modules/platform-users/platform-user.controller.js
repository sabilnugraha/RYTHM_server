import { createPlatformUserService } from './platform-user.service.js';

export async function createPlatformUserController(req, res, next) {
  try {
    const user = await createPlatformUserService(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Platform user created successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
