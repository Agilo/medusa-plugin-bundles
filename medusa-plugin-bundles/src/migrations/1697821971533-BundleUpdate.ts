import { MigrationInterface, QueryRunner } from "typeorm";

export class BundleUpdate1697821971533 implements MigrationInterface {
    name = 'BundleUpdate1697821971533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bundle" ADD "thumbnail" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bundle" DROP COLUMN "thumbnail"`);
    }

}
