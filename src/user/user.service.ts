import { Injectable, Logger, NotFoundException, Inject } from "@nestjs/common";
import { UserCreateDto, UserUpdateDto } from "./dto/user-query.dto";
import { UserRepository } from "./user.repo";
import { UserDto } from "./dto/user.dto";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserEntity } from "./user.entity";

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(private repo: UserRepository, @Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async getById(id: string) {
    const cachedData = await this.cacheService.get<UserEntity>(id);

    if (cachedData) {
      this.logger.debug(`Getting data from cache`);
      return cachedData;
    }

    const record = await this.repo.getById(id);

    if (!record) throw new NotFoundException(`User with specified user_id ${id} was not found or was deleted`);

    this.logger.debug(`Geting user by ID`, record);
    return record;
  }

  async getList(): Promise<UserDto[]> {
    this.logger.debug(`Get all users`);
    return this.repo.getList();
  }

  async create(body: UserCreateDto): Promise<UserDto> {
    const createdUser = await this.repo.create(body);
    const { id: userId, ...userData} = createdUser;

    await this.cacheService.set(userId.toString(), userData);

    this.logger.debug("User created", createdUser);
    return createdUser;
  }

  async update(id: string, body: UserUpdateDto): Promise<UserDto> {
    const record = await this.repo.getById(id);

    if (!record) throw new NotFoundException(`User with specified user_id ${id} was not found or was deleted`);

    await this.cacheService.set(id, body);

    const updatedUser = await this.repo.update(id, body);

    this.logger.debug(`User ${id} updated`, updatedUser);
    return updatedUser;

  }
}
