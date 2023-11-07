import { MigrationInterface, QueryRunner } from "typeorm";

export class BundleUpdate1698053520125 implements MigrationInterface {
    name = 'BundleUpdate1698053520125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bundle" ADD "handle" character varying`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8d369a8aa2fb8f02650dc9b823" ON "bundle" ("handle") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8d369a8aa2fb8f02650dc9b823"`);
        await queryRunner.query(`ALTER TABLE "bundle" DROP COLUMN "handle"`);
    }

}
