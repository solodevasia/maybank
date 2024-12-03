import { QueryUserList } from '@maybank/dto/user.dto';
import UserEntity from '@maybank/entities/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import _ from 'lodash';

@Injectable()
export default class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findOne(id: number) {
    const result = await this.repository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'pic', 'role', 'created_at', 'is_active'],
    });
    if (!result) {
      throw new HttpException(
        {
          message: false,
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { result, status: HttpStatus.OK };
  }

  async find(query: QueryUserList) {
    let page = Number(query.page || 1),
      limit = Number(query.limit || 10);
    const result = await this.repository.find({
      where: {
        ...(_.omit(query, ['page', 'limit']) as unknown as UserEntity),
      },
      select: ['id', 'name', 'email', 'pic', 'role', 'created_at', 'is_active'],
      skip: limit * page - limit || 0,
      take: limit,
    });
    const count = await this.repository.count();
    const pageSize = Math.max(Math.floor(count / limit), 1);
    return {
      result,
      page,
      nextUrl: page !== pageSize ? `/user?page=${page + 1}` : null,
      previousUrl: page !== 1 ? `/user?page=${page - 1}` : null,
      pageSize,
      count,
      status: HttpStatus.OK,
    };
  }
}
