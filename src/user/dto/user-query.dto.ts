import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { OmitType, PartialType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class GetByIdDto {
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}

export class UserCreateDto extends OmitType(UserDto, [
  "id",
]) {}

export class UserUpdateDto extends PartialType(
  OmitType(UserDto, ["id"]),
) {}
