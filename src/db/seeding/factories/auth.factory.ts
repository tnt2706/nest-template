import { define } from 'typeorm-seeding';
import { Auth } from '@api/entities';
import { AuthStatusEnum } from "@api/enums";
import * as Faker from 'faker';

define(Auth, () => {
  return new Auth({
    email: Faker.internet.email(),
    password: Faker.internet.password(),
    status: AuthStatusEnum.ACTIVE,
    timezoneName: 'Asia/SaiGon',
  });
})