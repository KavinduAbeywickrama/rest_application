import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum UserRole {
  INTERN = 'INTERN',
  ENGINEER = 'ENGINEER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.INTERN,
  })
  @IsEnum(UserRole, {
    message: 'Valid role required',
  })
  role: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
