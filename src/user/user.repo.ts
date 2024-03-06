import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { UserCreateDto, UserUpdateDto } from "./dto/user-query.dto";

@Injectable()
export class UserRepository {
  private userRepository: Repository<UserEntity>;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository<UserEntity>(UserEntity);
  }

  async getById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async getList(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async create(data: UserCreateDto): Promise<UserEntity> {
    return this.userRepository.save(data);
  }

  async update(id: string, data: UserUpdateDto): Promise<UserEntity> {
    await this.userRepository.update({ id }, data);

    return await this.userRepository.findOneByOrFail({ id });
  }
}
