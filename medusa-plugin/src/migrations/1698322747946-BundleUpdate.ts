import { MigrationInterface, QueryRunner } from "typeorm";

export class BundleUpdate1698322747946 implements MigrationInterface {
    name = 'BundleUpdate1698322747946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bundle_products_product" RENAME TO "bundle_product"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bundle_product" RENAME TO "bundle_products_product"`);
    }

}
