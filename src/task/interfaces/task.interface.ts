import { Document } from 'mongoose';

export interface Task extends Document {
  readonly title: string;
  readonly description: string;
  readonly assignedTo: string;
  readonly status: string;
}
