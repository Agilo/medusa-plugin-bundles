import { MigrationInterface, QueryRunner } from "typeorm";

export class BundleCreate1695645778620 implements MigrationInterface {
    name = 'BundleCreate1695645778620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bundle" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_637e3f87e837d6532109c198dea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bundle_products_product" ("bundleId" character varying NOT NULL, "productId" character varying NOT NULL, CONSTRAINT "PK_a4d0e7bae055822762807fe7f70" PRIMARY KEY ("bundleId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_462444303f07d3441460c3f915" ON "bundle_products_product" ("bundleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fe47c2aca0ba50911204da3344" ON "bundle_products_product" ("productId") `);
        await queryRunner.query(`ALTER TABLE "bundle_products_product" ADD CONSTRAINT "FK_462444303f07d3441460c3f9152" FOREIGN KEY ("bundleId") REFERENCES "bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bundle_products_product" ADD CONSTRAINT "FK_fe47c2aca0ba50911204da33444" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bundle_products_product" DROP CONSTRAINT "FK_fe47c2aca0ba50911204da33444"`);
        await queryRunner.query(`ALTER TABLE "bundle_products_product" DROP CONSTRAINT "FK_462444303f07d3441460c3f9152"`);
        await queryRunner.query(`DROP TABLE "bundle_products_product"`);
        await queryRunner.query(`DROP TABLE "bundle"`);
    }

}
