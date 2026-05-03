import 'dotenv/config';

import { createApp } from './app.js';
import { env } from './config/env.js';
import { seedRootPlatformUser } from './modules/platform-users/platform-user.service.js';

async function bootstrap() {
  await seedRootPlatformUser();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`${env.appName} is running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
