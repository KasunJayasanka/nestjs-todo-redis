import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Todo } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class TodoService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(data: Prisma.TodoCreateInput): Promise<Todo> {
    const todo = await this.prisma.todo.create({ data });
    await this.cacheManager.del('todos:all');
    return todo;
  }

  async findAll(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }

  async findOne(id: number): Promise<Todo | null> {
    return this.prisma.todo.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.TodoUpdateInput): Promise<Todo> {
    const todo = await this.prisma.todo.update({ where: { id }, data });
    await this.cacheManager.del('todos:all');
    await this.cacheManager.del(`GET/todos/${id}`);
    return todo;
  }

  async remove(id: number): Promise<Todo> {
    const todo = await this.prisma.todo.delete({ where: { id } });
    await this.cacheManager.del('todos:all');
    await this.cacheManager.del(`GET/todos/${id}`);
    return todo;
  }
}
