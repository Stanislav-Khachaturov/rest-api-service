import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateIf } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserEntity } from "../user.entity";

export class UserDto implements UserEntity {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: "generated uuid",
    example: "3745f6a9-ede4-44ee-855e-d7f41d7af09c",
    type: String,
    required: true,
  })
  id: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: "John" })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: "Doe" })
  last_name?: string;

  @IsOptional()
  @IsPhoneNumber()
  @ValidateIf(obj => obj.phone?.length > 0)
  @ApiPropertyOptional({ type: String, description: "User phone", nullable: true, required: false })
  phone?: string;

  @IsOptional()
  @IsEmail()
  @ValidateIf(obj => obj.email?.length > 0)
  @ApiPropertyOptional({ type: String, description: "User email" })
  email?: string;

  @IsOptional()
  @ApiPropertyOptional({ type: String, description: "Login" })
  login?: string;
}
