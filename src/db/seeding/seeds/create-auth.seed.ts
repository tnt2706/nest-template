import { Connection } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';
import { Auth } from '@api/entities';
import { EncryptHelper } from '@base/helpers';
import * as authData from './data/auth.json';

export default class CreateAuth implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const arr = await Promise.all(
      authData.map(async item => ({
        ...item,
        password: await EncryptHelper.hash(item.password),
      })),
    );
    await connection
      .createQueryBuilder()
      .insert()
      .into(Auth)
      .values(arr as any)
      .execute();

    // generate random auth
    // await factory(Auth)().createMany(5);
  }
}
