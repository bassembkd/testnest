import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return await createdTask.save();
  }

  async assignTask(taskId: string, userId: string): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(taskId, { assignedTo: userId }, { new: true }).exec();
  }

  async updateTaskStatus(taskId: string, updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(taskId, updateTaskStatusDto, { new: true }).exec();
  }

  async getTasks(status: string, page: number, limit: number): Promise<Task[]> {
    const query = status ? { status } : {};
    return await this.taskModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async markTaskAsCompleted(taskId: string): Promise<any> {
    const result = await this.taskModel.updateOne({ _id: taskId }, { status: 'completed' });
    
    if (result.modifiedCount  === 0) {
      throw new NotFoundException('Task not found or already completed');
    }

    const updatedTask = await this.taskModel.findById(taskId);
    return updatedTask;
  }

}
