import { Controller, Post, Put, Get, Param, Body, Query, UseGuards, NotFoundException,Injectable, Delete} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Task } from './interfaces/task.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Controller('tasks')
export class TaskController {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<Task>,
    private readonly taskService: TaskService 
  ) {}

  @Post('/createone')
  @Roles('admin')
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.taskService.create(createTaskDto);
  }

  @Get('/findtaskById:taskId')
  @Roles('admin')
  async findtaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  @Put('/updatetask')
  @Roles('admin')
  async updatetask(id: string, updateTaskDto: UpdateTaskStatusDto): Promise<Task> {
    const updatedTask = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return updatedTask;
  }

  @Delete('/deletetask')
  @Roles('admin')
  async deletetask(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Task not found');
    }
  }

  @Post('assign/:taskId')
  @Roles('admin')
  async assignTask(@Param('taskId') taskId: string, @Body('userId') userId: string) {
    return await this.taskService.assignTask(taskId, userId);
  }

  @Put('complete/:taskId')
  @Roles('user')
  async markTaskAsCompleted(@Param('taskId') taskId: string) {
    return await this.taskService.markTaskAsCompleted(taskId);
  }

  @Get()
  @Roles('admin')
  async getTasks(@Query('status') status: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return await this.taskService.getTasks(status, page, limit);
  }
}
