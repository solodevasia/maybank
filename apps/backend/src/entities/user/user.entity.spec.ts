import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import UserEntity from './user.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import database from '@maybank/configuration/database';
import fs from 'fs';
import { join } from 'path';

describe('UserEntity', () => {
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(database),
        TypeOrmModule.forFeature([UserEntity]),
      ],
    }).compile();

    repository = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should to be defined', () => expect(repository).toBeDefined());

  it('render correctly', () => expect(repository).toMatchSnapshot());

  it('should create new user', async () => {
    const create = repository.create({
      name: faker.internet.username(),
      email: faker.internet.email(),
      password: 'password',
    });
    await repository.save(create);
    const find = await repository.find({ order: { created_at: 'DESC' } });
    fs.writeFileSync(
      join(__dirname, '../../../folder/create.txt'),
      JSON.stringify(create),
    );
    expect(find[0].name).toEqual(create.name);
  });

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

    it('findOne should to be successfully', async () =>
      expect(
        (await repository.findOne({ where: { id: user.id } }))?.name,
      ).toEqual(user.name));

    it('findAll should to be successfully', async () =>
      expect(await repository.find()).not.toEqual(0));
  }
});
