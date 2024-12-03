import AuthGuard from '@maybank/decorators/auth-guard';
import {
  LoginField,
  QueryUserList,
  UpdatedSchema,
  UserRegisterField,
} from '@maybank/dto/user.dto';
import UserRepository from '@maybank/repository/user/user.repository';
import UserService from '@maybank/services/user/user.service';
import { CustomRequest } from '@maybank/types/request';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

@Controller('user')
export default class UserController {
  constructor(
    private readonly repository: UserRepository,
    private readonly service: UserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  created(@Body() body: UserRegisterField) {
    return this.service.created(body);
  }

  @Post('/login/access')
  @HttpCode(HttpStatus.OK)
  loginAccess(@Body() body: LoginField) {
    return this.service.login(body);
  }

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  profile(@Req() req: CustomRequest) {
    return this.repository.findOne(req.user.id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  updated(@Param('id') id: number, @Body() body: UpdatedSchema) {
    return this.service.updated(id, body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: number, @Req() req: CustomRequest) {
    return this.service.destroy(id, req.user.role);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  list(@Query() query: QueryUserList) {
    return this.repository.find(query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  detail(@Param('id') id: number) {
    return this.repository.findOne(id);
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: CustomRequest) {
    return this.service.logout(req.user.id);
  }
}
