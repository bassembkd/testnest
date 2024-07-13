import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @IsEnum(['completed', 'pending'])
  readonly status: string;
}

