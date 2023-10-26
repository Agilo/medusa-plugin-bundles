import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { DbAwareColumn, generateEntityId } from "@medusajs/medusa/dist/utils";
import { Product } from "./product";
import _ from "lodash";

export enum BundleStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

@Entity()
export class Bundle extends BaseEntity {
  static bundleProductJoinTable = "bundle_product";

  @Column({ type: "varchar" })
  title: string | null;

  @Index({ unique: true })
  @Column({ type: "varchar" })
  handle: string;

  @Column({ type: "varchar" })
  description: string | null;

  @ManyToMany(() => Product, (product) => product.bundles)
  @JoinTable({
    name: Bundle.bundleProductJoinTable,
    joinColumn: {
      name: "bundle_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[];

  @DbAwareColumn({ type: "enum", enum: BundleStatus, default: "draft" })
  status: BundleStatus;

  @Column({ type: "text", nullable: true })
  thumbnail: string | null;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "bundle");

    if (!this.handle) {
      this.handle = _.kebabCase(this.title);
    }
  }
}

/**
 * @schema Bundle
 * title: "Bundle"
 * description: "A bundle is a group of products."
 * type: object
 * required:
 *   - created_at
 *   - description
 *   - handle
 *   - id
 *   - products
 *   - status
 *   - thumbnail
 *   - title
 *   - updated_at
 * properties:
 *   id:
 *     description: The bundle's ID
 *     type: string
 *     example: bundle_01G1G5V2MBA328390B5AXJ610F
 *   title:
 *     description: A title that can be displayed for easy identification of the Bundle.
 *     type: string
 *     example: Medusa Coffee Mug Set
 *   handle:
 *     description: A unique string that identifies the Product Bundle - can for example be used in slug structures.
 *     type: string
 *     example: drumkit
 *   description:
 *     description: A short description of the Bundle.
 *     nullable: true
 *     type: string
 *     example: Every programmer's best friends.
 *   products:
 *     description: The details of the products used in this bundle.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Product"
 *   status:
 *     description: The status of the bundle
 *     type: string
 *     enum:
 *       - draft
 *       - published
 *     default: draft
 *   thumbnail:
 *     description: A URL to an image file that can be used to identify the Bundle.
 *     nullable: true
 *     type: string
 *     format: uri
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 */
