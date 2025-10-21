import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Prisma } from '@prisma/client';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() data: Prisma.TodoCreateInput) {
    return this.todoService.create(data);
  }

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.TodoUpdateInput,
  ) {
    return this.todoService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.remove(id);
  }
}
