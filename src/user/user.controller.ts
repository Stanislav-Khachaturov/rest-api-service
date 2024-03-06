import { Controller, Get, Param, Post, Body, Patch, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { GetByIdDto, UserCreateDto, UserUpdateDto } from "./dto/user-query.dto";
import { UserDto } from "./dto/user.dto";

@Controller({ path: "user" })
@ApiTags("User")
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({
    description: "Get user by id",
    type: UserDto,
  })
  @Get(":id")
  async getById(@Param() params: GetByIdDto): Promise<UserDto> {
    return this.userService.getById(params.id);
  }

  @ApiOkResponse({
    description: "Get list of users",
    type: [UserDto],
  })
  @Get("getList")
  async getList(): Promise<UserDto[]> {
    return this.userService.getList();
  }

  @ApiOkResponse({
    description: "Create a new user",
    type: UserDto,
  })
  @Post()
  async create(@Body() body: UserCreateDto): Promise<UserDto> {
    return this.userService.create(body);
  }

  @ApiOkResponse({
    description: "Update the user",
    type: UserDto,
  })
  @Patch(":id")
  async update(@Param() params: GetByIdDto, @Body() body: UserUpdateDto): Promise<UserDto> {
    return this.userService.update(params.id, body);
  }
}
