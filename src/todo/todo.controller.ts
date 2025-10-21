import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'; // Correct import
import { TodoService } from './todo.service';
import { Prisma } from '@prisma/client';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() data: Prisma.TodoCreateInput) {
    return this.todoService.create(data);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('todos:all')
  @CacheTTL(60) // 60 seconds
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60) // 60 seconds
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
