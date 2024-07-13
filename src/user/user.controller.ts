import { Controller, Put, Param, Body, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ObjectId } from 'mongodb';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('profile/:id')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    const userObjectId = new ObjectId(req.user.userId);
    const idObjectId = new ObjectId(id);
  
    if (!userObjectId.equals(idObjectId)) {
      throw new UnauthorizedException('You can only update your own profile');
    }
    return await this.userService.updateMyProfile(id, updateUserDto);
  }
}
