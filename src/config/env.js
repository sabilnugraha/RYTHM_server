export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  appName: process.env.APP_NAME ?? 'RYTHM Server',
  root: {
    fullName: process.env.Fullname ?? process.env.FULLNAME ?? '',
    email: process.env.Emailroot ?? process.env.EMAILROOT ?? '',
    password: process.env.Passwordroot ?? process.env.PASSWORDROOT ?? '',
  },
};
