import { MigrationInterface, QueryRunner } from "typeorm";

export class BundleUpdate1697190600521 implements MigrationInterface {
    name = 'BundleUpdate1697190600521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bundle_status_enum" AS ENUM('draft', 'published')`);
        await queryRunner.query(`ALTER TABLE "bundle" ADD "status" "public"."bundle_status_enum" NOT NULL DEFAULT 'draft'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bundle" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."bundle_status_enum"`);
    }

}
