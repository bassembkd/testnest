import { Controller, Post, Put, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user/user.service'
import { CreateUserDto } from './user/dto/create-user.dto';
import { UpdateUserDto } from './user/dto/update-user.dto';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

}
