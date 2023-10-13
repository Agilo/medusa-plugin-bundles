import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { DbAwareColumn, generateEntityId } from "@medusajs/medusa/dist/utils";
import { Product } from "./product";

export enum BundleStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

@Entity()
export class Bundle extends BaseEntity {
  @Column({ type: "varchar" })
  title: string | null;

  @Column({ type: "varchar" })
  description: string | null;

  @ManyToMany(() => Product, (product) => product.bundles)
  @JoinTable()
  products: Product[];

  @DbAwareColumn({ type: "enum", enum: BundleStatus, default: "draft" })
  status: BundleStatus;

  // @OneToOne(() => Product)
  // @JoinColumn()
  // product: Product;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "bundle");
  }
}
