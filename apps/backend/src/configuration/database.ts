import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  autoLoadEntities: true,
} as Partial<TypeOrmModuleOptions>;
