import { Entity, ManyToMany } from "typeorm";
import {
  // alias the core entity to not cause a naming conflict
  Product as MedusaProduct,
} from "@medusajs/medusa";
import { Bundle } from "./bundle";

@Entity()
export class Product extends MedusaProduct {
  @ManyToMany(() => Bundle, (bundle) => bundle.products)
  bundles: Bundle[];
}
