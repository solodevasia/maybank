import database from '@maybank/configuration/database';
import UserEntity from '@maybank/entities/user/user.entity';
import UserModule from '@maybank/modules/user.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import supertest from 'supertest';
import fs from 'fs';
import { join } from 'path';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoginField, UserRegisterField } from '@maybank/dto/user.dto';
import { faker } from '@faker-js/faker/.';

describe('UserController', () => {
  let app: INestApplication;
  let repository: Repository<UserEntity>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: fs.readFileSync(join(__dirname, '../../../jwtRS256.key'), {
            encoding: 'utf-8',
          }),
          signOptions: { expiresIn: '60s' },
        }),
        TypeOrmModule.forRoot(database),
        UserModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    repository = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    jwtService = moduleRef.get(JwtService);
    await app.init();
  });

  it('should to be defined', () => expect(app).toBeDefined());

  it('render correctly', () => expect(app.getHttpServer()).toMatchSnapshot());

  it('should register an account', async () =>
    await supertest(app.getHttpServer())
      .post('/user')
      .set('Content-Type', 'application/json')
      .send({
        name:
          (await repository.count()) <= 2 ? 'admin' : faker.internet.username(),
        email:
          (await repository.count()) <= 2
            ? 'admin@admin.com'
            : faker.internet.email(),
        pic: faker.commerce.productMaterial(),
        role: (await repository.count()) <= 2 ? 1 : 2,
        password: '12345678',
        confirmation: '12345678',
      } as Partial<UserRegisterField>)
      .expect(HttpStatus.CREATED)
      .expect({
        message: 'Account has been created',
        status: HttpStatus.CREATED,
      }));

  it("should register an account but password don't match", async () =>
    await supertest(app.getHttpServer())
      .post('/user')
      .set('Content-Type', 'application/json')
      .send({
        name: faker.internet.username(),
        email: faker.internet.email(),
        password: 'password',
        confirmation: 'passwodwqdwqrd',
      } as Partial<UserRegisterField>)
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        message: "Password don't match, please check again",
        status: HttpStatus.BAD_REQUEST,
      }));

  it('should register an account but account already exists', async () => {
    const find = await repository.find({
      take: 1,
    });
    await supertest(app.getHttpServer())
      .post('/user')
      .set('Content-Type', 'application/json')
      .send({
        name: find[0].name,
        email: faker.internet.email(),
        password: 'password',
        confirmation: 'password',
      } as Partial<UserRegisterField>)
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        message: 'Username or email already exists',
        status: HttpStatus.BAD_REQUEST,
      });
  });

  it('should call api "/login/access"', async () => {
    const find = await repository.find({
      take: 1,
      order: { created_at: 'DESC' },
    });
    await supertest(app.getHttpServer())
      .post('/user/login/access')
      .set('Content-Type', 'application/json')
      .send({
        token: find[0].name,
        password: '12345678',
      } as Partial<LoginField>)
      .expect(HttpStatus.OK)
      .then((res) => {
        fs.writeFileSync(
          join(__dirname, '../../../folder/token.txt'),
          res.body.accessToken,
        );
        expect(res.body).toEqual({
          accessToken: res.body.accessToken,
          status: HttpStatus.OK,
        });
      });
  });

  it('should call api "/login/access" but account not found', async () =>
    await supertest(app.getHttpServer())
      .post('/user/login/access')
      .set('Content-Type', 'application/json')
      .send({
        token: 'dwqdqwdq',
        password: 'password',
      } as Partial<LoginField>)
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        message: 'Username or password inccorect',
        status: HttpStatus.BAD_REQUEST,
      }));

  it('should call api "/login/access" but invalid password', async () => {
    const find = await repository.find({ take: 1 });
    await supertest(app.getHttpServer())
      .post('/user/login/access')
      .set('Content-Type', 'application/json')
      .send({
        token: find[0].name,
        password: 'passwdwqdwqkmkord',
      } as Partial<LoginField>)
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        message: 'Username or password inccorect',
        status: HttpStatus.BAD_REQUEST,
      });
  });

  it('should call api "/user"', async () =>
    await supertest(app.getHttpServer())
      .get('/user')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.UNAUTHORIZED));

  it('should call api "/user"', async () =>
    await supertest(app.getHttpServer())
      .get('/user')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer dqwdq`)
      .expect(HttpStatus.UNAUTHORIZED));

  if (
    fs.readFileSync(join(__dirname, '../../../folder/token.txt'), {
      encoding: 'utf-8',
    })
  ) {
    const token = fs.readFileSync(
      join(__dirname, '../../../folder/token.txt'),
      { encoding: 'utf-8' },
    );

    it('should call api destroy "/user/:id"', async () => {
      const admin = await repository.findOne({ where: { role: 1 } });
      const findDestroy = await repository.find({
        where: { role: 2 },
        order: { created_at: 'asc' },
      });
      if ((await repository.count()) >= 8) {
        await supertest(app.getHttpServer())
          .delete(`/user/${findDestroy[0].id}`)
          .set('Content-Type', 'application/json')
          .set(
            'Authorization',
            `Bearer ${await jwtService.signAsync(JSON.stringify(admin), {
              secret: fs.readFileSync(
                join(__dirname, '../../../jwtRS256.key'),
                {
                  encoding: 'utf-8',
                },
              ),
            })}`,
          )
          .expect(HttpStatus.OK)
          .expect({
            message: 'Account has been deleted',
            status: HttpStatus.OK,
          });
      }
    });

    it('should call api destroy "/user/:id" but account not found', async () => {
      const admin = await repository.findOne({ where: { role: 1 } });

      await supertest(app.getHttpServer())
        .delete(`/user/092821`)
        .set('Content-Type', 'application/json')
        .set(
          'Authorization',
          `Bearer ${await jwtService.signAsync(JSON.stringify(admin), {
            secret: fs.readFileSync(join(__dirname, '../../../jwtRS256.key'), {
              encoding: 'utf-8',
            }),
          })}`,
        )
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: 'Account not found',
          status: HttpStatus.BAD_REQUEST,
        });
    });

    it('should call api destroy "/user/:id" but not admin', async () => {
      const findDestroy = await repository.find({
        where: { role: 2 },
        order: { created_at: 'asc' },
      });
      await supertest(app.getHttpServer())
        .delete(`/user/${findDestroy[0].id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: "You don't have this access!",
          status: HttpStatus.BAD_REQUEST,
        });
    });

    it('should call api "/user/:id"', async () => {
      const user = (await jwtService.verifyAsync(token, {
        secret: fs.readFileSync(join(__dirname, '../../../jwtRS256.key'), {
          encoding: 'utf-8',
        }),
      })) as UserEntity;
      await supertest(app.getHttpServer())
        .put(`/user/${user.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name:
            user.name === 'admin'
              ? user.name
              : `updated - ${faker.internet.username()}`,
          email:
            user.email === 'admin@admin.com'
              ? user.email
              : `updated${faker.internet.email()}`,
        })
        .expect(HttpStatus.OK)
        .expect({ message: 'Account has been updated', status: HttpStatus.OK });
    });

    it('should call api "/user/:id" account not found', async () => {
      await supertest(app.getHttpServer())
        .put(`/user/092912`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: `updated - ${faker.internet.username()}`,
          email: `updated${faker.internet.email()}`,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: 'Account not found',
          status: HttpStatus.BAD_REQUEST,
        });
    });

    it('should call api "/user/logout"', async () =>
      await supertest(app.getHttpServer())
        .post('/user/logout')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect({ message: 'successfully', status: HttpStatus.OK }));

    it('should call api "/user"', async () =>
      await supertest(app.getHttpServer())
        .get('/user')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .then((res) =>
          expect(res.body).toEqual({
            result: res.body.result,
            page: 1,
            previousUrl: null,
            nextUrl: res.body.pageSize >= 2 ? '/user?page=2' : null,
            pageSize: res.body.pageSize,
            count: res.body.count,
            status: HttpStatus.OK,
          }),
        ));

    it('should call api "/user/profile"', async () =>
      await supertest(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK)
        .then((res) =>
          expect(res.body).toEqual({
            result: res.body.result,
            status: HttpStatus.OK,
          }),
        ));

    if (
      fs.readFileSync(join(__dirname, '../../../folder/create.txt'), {
        encoding: 'utf-8',
      })
    ) {
      const user = JSON.parse(
        fs.readFileSync(join(__dirname, '../../../folder/create.txt'), {
          encoding: 'utf-8',
        }),
      );

      it('should call api "/user/:id"', async () =>
        await supertest(app.getHttpServer())
          .get(`/user/${user.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK)
          .then((res) =>
            expect(res.body).toEqual({
              result: res.body.result,
              status: HttpStatus.OK,
            }),
          ));

      it('should call api "/user/:id" not found', async () =>
        await supertest(app.getHttpServer())
          .get(`/user/dqwdwq`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.BAD_REQUEST));
    }

    if (
      fs.readFileSync(join(__dirname, '../../../folder/pageSize.txt'), {
        encoding: 'utf-8',
      })
    ) {
      const pageSize = fs.readFileSync(
        join(__dirname, '../../../folder/pageSize.txt'),
        {
          encoding: 'utf-8',
        },
      );

      if (Number(pageSize) >= 3) {
        it('should call api "/user?page=2"', async () =>
          await supertest(app.getHttpServer())
            .get('/user')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .query({ page: 2 })
            .expect(HttpStatus.OK)
            .then((res) => {
              expect(res.body).toEqual({
                result: res.body.result,
                page: 2,
                previousUrl: '/user?page=1',
                nextUrl: '/user?page=3',
                pageSize: res.body.pageSize,
                count: res.body.count,
                status: HttpStatus.OK,
              });
            }));
      }

      it('should call api "/user?page=lastPage"', async () =>
        await supertest(app.getHttpServer())
          .get(`/user?page=${pageSize}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK)
          .then(async (res) =>
            expect(res.body).toEqual({
              result: res.body.result,
              page: Number(pageSize),
              previousUrl:
                Number(pageSize) > 1
                  ? `/user?page=${Number(pageSize) - 1}`
                  : null,
              nextUrl: null,
              pageSize: res.body.pageSize,
              count: res.body.count,
              status: HttpStatus.OK,
            }),
          ));
    }
  }

  afterEach(async () => {
    fs.writeFileSync(
      join(__dirname, '../../../folder/pageSize.txt'),
      `${Math.floor((await repository.count()) / 10) || 1}`,
    );
  });
});
