import { PrimaryGeneratedColumn, Column } from "typeorm";

export class UserEntity {
  @PrimaryGeneratedColumn("uuid", { primaryKeyConstraintName: "pk_user" })
  id: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  name?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  last_name?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  login?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  phone?: string;
}
