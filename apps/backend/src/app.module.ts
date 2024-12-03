import { Module } from '@nestjs/common';
import UserModule from './modules/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import database from './configuration/database';
import { JwtModule } from '@nestjs/jwt';
import fs from 'fs';
import { join } from 'path';

console.log(__dirname);

@Module({
  imports: [
    TypeOrmModule.forRoot(database),
    JwtModule.register({
      secretOrPrivateKey: fs.readFileSync(join(__dirname, '../jwtRS256.key')),
      signOptions: { expiresIn: '1000s' },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
