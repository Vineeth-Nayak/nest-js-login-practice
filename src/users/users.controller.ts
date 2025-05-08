import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserQueryDTO } from './dto/get-user-query.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  @UsePipes(new ValidationPipe())
  getUser(@Query() queryParams: UserQueryDTO) {
    return this.userService.getUser(queryParams);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserId(id);
  }
}
