import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuthStatusEnum } from '@api/enums';
import { EncryptHelper } from '@base/helpers';
import { Exclude, classToPlain } from 'class-transformer';
import { CommonService } from '~/modules/base/services/common.service';

@Entity()
export class Auth extends BaseEntity {
  
  constructor(partial: Partial<Auth>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 360,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  password: string;

  @Column('enum', {
    enum: AuthStatusEnum,
    nullable: false,
    default: AuthStatusEnum.INACTIVE,
  })
  status: AuthStatusEnum = AuthStatusEnum.INACTIVE;

  @Column({
    name: 'timezone_name',
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  timezoneName: string;

  @Exclude()
  @Column({
    name: 'fcmTokens',
    type: 'json',
    nullable: true,
  })
  fcmTokens: string[];

  @Exclude()
  @Column({
    name: 'loggingTokens',
    type: 'json',
    nullable: true,
  })
  loggingTokens: string[];

  toJSON() {
    return classToPlain(this);
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  @BeforeInsert()
  async beforeInsert() {
    this.password = await CommonService.hashPassword(this.password);
  }

  @BeforeUpdate()
  beforeUpdate() {
  }
}
