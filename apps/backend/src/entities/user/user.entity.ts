import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import bcrypt from 'bcrypt';
import { Role } from '@maybank/types/role';

@Entity({
  name: 'user',
  schema: 'authenticates',
})
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: false })
  name!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  pic!: string;

  @Column({ type: 'simple-enum', enum: Role, default: Role.user })
  role!: number;

  @Column()
  created_at: Date = new Date();

  @Column()
  is_active: boolean = false;

  @BeforeInsert()
  beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
    if (!this.role) {
      this.role = Role.user;
    }
  }

  checkPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
