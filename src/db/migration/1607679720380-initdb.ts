import {MigrationInterface, QueryRunner} from "typeorm";

export class initdb1607679720380 implements MigrationInterface {
    name = 'initdb1607679720380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "auth_status_enum" AS ENUM('active', 'inactive', 'deleted')`);
        await queryRunner.query(`CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(360) NOT NULL, "password" character varying(60), "status" "auth_status_enum" NOT NULL DEFAULT 'inactive', "timezone_name" character varying(36) NOT NULL, "fcmTokens" json, "loggingTokens" json, CONSTRAINT "UQ_b54f616411ef3824f6a5c06ea46" UNIQUE ("email"), CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TYPE "auth_status_enum"`);
    }

}
