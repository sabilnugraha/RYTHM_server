import { env } from '../config/env.js';

export function getHealth(_req, res) {
  res.status(200).json({
    status: 'success',
    message: 'RYTHM Server is healthy',
    data: {
      app: env.appName,
      environment: env.nodeEnv,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
}
