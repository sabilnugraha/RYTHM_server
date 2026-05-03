import { createApp } from '../src/app.js';
import { seedRootPlatformUser } from '../src/modules/platform-users/platform-user.service.js';

const app = createApp();
let seedPromise = null;

async function seedRootOnce() {
  if (seedPromise === null) {
    seedPromise = seedRootPlatformUser();
  }

  return seedPromise;
}

export default async function main(request, response) {
  await seedRootOnce();
  return app(request, response);
}
