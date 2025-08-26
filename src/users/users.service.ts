import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(role?: UserRole) {
    const users = await this.userRepository.findAll(role);
    if (role && users.length === 0) {
      throw new NotFoundException('No users with this role');
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Check if user exists
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    await this.findOne(id); // Check if user exists
    await this.userRepository.remove(id);
    return { message: `User with ID ${id} deleted successfully` };
  }
}
