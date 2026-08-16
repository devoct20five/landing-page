import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  dialect: 'mysql' as const,
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'oct20five',

  autoLoadModels: true,
  synchronize: false,

  logging: process.env.NODE_ENV === 'development' ? console.log : false,
}));
