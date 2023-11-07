import { MigrationInterface, QueryRunner } from "typeorm";

export class BundleUpdate1698323456861 implements MigrationInterface {
    name = 'BundleUpdate1698323456861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bundle_product" RENAME COLUMN "bundleId" TO "bundle_id";`);
        await queryRunner.query(`ALTER TABLE "bundle_product" RENAME COLUMN "productId" TO "product_id";`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bundle_product" RENAME COLUMN "bundle_id" TO "bundleId";`);
        await queryRunner.query(`ALTER TABLE "bundle_product" RENAME COLUMN "product_id" TO "productId";`);
    }

}
