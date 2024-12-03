import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserController from '@maybank/controllers/user/user.controller';
import UserEntity from '@maybank/entities/user/user.entity';
import UserRepository from '@maybank/repository/user/user.repository';
import UserService from '@maybank/services/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [JwtService, UserRepository, UserService],
})
export default class UserModule {}
