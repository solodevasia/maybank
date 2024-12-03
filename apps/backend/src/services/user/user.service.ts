import {
  LoginField,
  UpdatedSchema,
  userRegisterField,
  UserRegisterField,
} from '@maybank/dto/user.dto';
import UserEntity from '@maybank/entities/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import fs from 'fs';
import { join } from 'path';
import { Role } from '@maybank/types/role';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async created(body: UserRegisterField) {
    const parse = userRegisterField.safeParse(body);
    if (parse.error) {
      throw new HttpException(
        {
          message: parse.error.errors[0].message,
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const findOne = await this.repository.findOne({
      where: [{ name: body.name }, { email: body.email }],
    });
    if (findOne) {
      throw new HttpException(
        {
          message: 'Username or email already exists',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    delete body['confirmation'];
    await this.repository.save(this.repository.create(body));
    return { message: 'Account has been created', status: HttpStatus.CREATED };
  }

  async login(body: LoginField) {
    const where = [{ name: body.token }, { email: body.token }];
    const findOne = await this.repository.findOne({ where });
    if (!findOne) {
      throw new HttpException(
        {
          message: 'Username or password inccorect',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!findOne.checkPassword(body.password, findOne.password)) {
      throw new HttpException(
        {
          message: 'Username or password inccorect',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = (await this.repository.findOne({
      where,
      select: ['id', 'name', 'email', 'pic', 'role', 'created_at'],
    })) as UserEntity;
    user['is_active'] = true;
    await this.repository.manager.save(user);

    return {
      accessToken: await this.jwtService.signAsync(JSON.stringify(user), {
        secret: fs.readFileSync(join(__dirname, '../../../jwtRS256.key'), {
          encoding: 'utf-8',
        }),
      }),
      status: HttpStatus.OK,
    };
  }

  async destroy(id: number, currentUserRole: number) {
    const findOne = await this.repository.findOne({ where: { id } });
    if (!findOne) {
      throw new HttpException(
        {
          message: 'Account not found',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (currentUserRole === 2) {
      throw new HttpException(
        {
          message: "You don't have this access!",
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.repository.delete(findOne.id);
    return { message: 'Account has been deleted', status: HttpStatus.OK };
  }

  async updated(id: number, body: UpdatedSchema) {
    const findOne = await this.repository.findOne({ where: { id } });
    if (!findOne) {
      throw new HttpException(
        {
          message: 'Account not found',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    findOne.name = body.name;
    findOne.email = body.email;
    findOne.pic = body.pic;
    findOne.role = body.role as unknown as number;
    await this.repository.save(findOne);
    return { message: 'Account has been updated', status: HttpStatus.OK };
  }

  async logout(id: number) {
    const findOne = (await this.repository.findOne({
      where: { id },
    })) as UserEntity;
    findOne.is_active = false;
    await this.repository.manager.save(findOne);
    return { message: 'successfully', status: HttpStatus.OK };
  }
}
