import UserEntity from '@maybank/entities/user/user.entity';
import { Request } from 'express';

export interface CustomRequest extends Request {
    user: UserEntity
}
