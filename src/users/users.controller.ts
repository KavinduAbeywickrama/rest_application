import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id };
  }

  @Post()
  create(@Body() user: object) {
    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userUpdate: object) {
    return { id, ...userUpdate };
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return { id };
  }

  @Get()
  find(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'MANAGER') {
    return { role, users: [] };
  }
}
