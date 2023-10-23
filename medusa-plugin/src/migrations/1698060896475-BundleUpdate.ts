import { MigrationInterface, QueryRunner } from "typeorm";

export class BundleUpdate1698060896475 implements MigrationInterface {
    name = 'BundleUpdate1698060896475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bundle" ALTER COLUMN "handle" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bundle" ALTER COLUMN "handle" DROP NOT NULL`);
    }

}
