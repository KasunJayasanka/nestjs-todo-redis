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
    const cached = await this.cacheManager.get<Todo[]>('todos:all');
    if (cached) return cached;

    const todos = await this.prisma.todo.findMany();
    await this.cacheManager.set('todos:all', todos, 60);
    return todos;
  }

  async findOne(id: number): Promise<Todo | null> {
    const cached = await this.cacheManager.get<Todo>(`todos:${id}`);
    if (cached) return cached;

    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (todo) await this.cacheManager.set(`todos:${id}`, todo, 60);
    return todo;
  }

  async update(id: number, data: Prisma.TodoUpdateInput): Promise<Todo> {
    const todo = await this.prisma.todo.update({ where: { id }, data });
    await this.cacheManager.del('todos:all');
    await this.cacheManager.del(`todos:${id}`);
    return todo;
  }

  async remove(id: number): Promise<Todo> {
    const todo = await this.prisma.todo.delete({ where: { id } });
    await this.cacheManager.del('todos:all');
    await this.cacheManager.del(`todos:${id}`);
    return todo;
  }
}
