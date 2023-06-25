import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  firstName: string;

  @Column({ length: 20 })
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ length: 40 })
  streetAddress: string;

  @Column({ length: 20 })
  city: string;

  @Column({ length: 20 })
  province: string;

  @Column({ length: 15 })
  telephoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  token: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  registrationDate: Date;
}
