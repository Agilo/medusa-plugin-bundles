import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  ManyToMany,
  PrimaryColumn,
} from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { Product } from "./product";

@Entity()
export class Bundle extends BaseEntity {
  @Column({ type: "varchar" })
  title: string | null;

  @Column({ type: "varchar" })
  description: string | null;

  @ManyToMany(() => Product, (product) => product.bundles)
  @JoinTable()
  products: Product[];

  // @OneToOne(() => Product)
  // @JoinColumn()
  // product: Product;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "bundle");
  }
}
