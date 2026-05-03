export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  appName: process.env.APP_NAME ?? 'RYTHM Server',
};
