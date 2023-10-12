import {
  EventBusService,
  FindConfig,
  Selector,
  TransactionBaseService,
  buildQuery,
} from "@medusajs/medusa";
import { Bundle } from "../models/bundle";
import { Product } from "../models/product";
import ProductRepository from "@medusajs/medusa/dist/repositories/product";
import BundleRepository from "../repositories/bundle";
import { escapeLikeString } from "../utils/escape-like-string";
import { Brackets } from "typeorm";

type InjectedDependencies = {
  eventBusService: EventBusService;
  productRepository: typeof ProductRepository;
  bundleRepository: typeof BundleRepository;
};

type ListAndCountSelector = {
  q?: string;
};

type ListAndCountFindConfig = {
  skip: number;
  take: number;
};

type ListAndCountProductsSelector = {
  bundle_id: string;
  q?: string;
};

type ListAndCountProductsFindConfig = {
  skip?: number;
  take?: number;
};

export default class BundleService extends TransactionBaseService {
  protected readonly eventBus_: EventBusService;
  protected readonly productRepository_: typeof ProductRepository;
  protected readonly bundleRepository_: typeof BundleRepository;

  constructor({
    eventBusService,
    productRepository,
    bundleRepository,
  }: InjectedDependencies) {
    super(arguments[0]);

    this.eventBus_ = eventBusService;
    this.productRepository_ = productRepository;
    this.bundleRepository_ = bundleRepository;
  }

  async listAndCount(
    selector: ListAndCountSelector = {},
    config: ListAndCountFindConfig = {
      skip: 0,
      take: 10,
    }
  ): Promise<[Bundle[], number]> {
    const bundleRepo = this.activeManager_.getRepository(Bundle);

    let queryBuilder = bundleRepo
      .createQueryBuilder(`bundle`)
      .skip(config.skip)
      .take(config.take);

    if (selector.q) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where(`bundle.title ILIKE :q`, {
            q: `%${escapeLikeString(selector.q)}%`,
          }).orWhere(`bundle.description ILIKE :q`, {
            q: `%${escapeLikeString(selector.q)}%`,
          });
        })
      );
    }

    return queryBuilder.getManyAndCount();
  }

  async retrieve(id: string, config?: FindConfig<Bundle>): Promise<Bundle> {
    const query = buildQuery(
      {
        id,
      },
      config
    );

    const bundle = await this.bundleRepository_.findOneOrFail(query);
    return bundle;
  }

  async create(data: { title: string; description?: string }): Promise<Bundle> {
    return this.atomicPhase_(async (manager) => {
      // const postRepo = manager.withRepository(this.postRepository_);
      const bundleRepo = manager.getRepository(Bundle);
      const bundle = bundleRepo.create();
      bundle.title = data.title;
      bundle.description = data.description;
      const result = await bundleRepo.save(bundle);
      return result;
    });
  }

  async update(
    bundleId: string,
    data: { title: string; description?: string }
  ): Promise<Bundle> {
    return await this.atomicPhase_(async (manager) => {
      const bundleRepo = manager.withRepository(this.bundleRepository_);

      let bundle = await this.retrieve(bundleId);

      for (const [key, value] of Object.entries(data)) {
        bundle[key] = value;
      }

      bundle = await bundleRepo.save(bundle);

      return bundle;
    });
  }

  async delete(bundleId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const bundleRepo = manager.withRepository(this.bundleRepository_);

      // Should not fail, if bundle does not exist, since delete is idempotent
      const bundle = await bundleRepo.findOne({
        where: { id: bundleId },
        relations: ["products"],
      });

      if (!bundle) {
        return;
      }

      // TODO: check if this removes product relations
      await bundleRepo.remove(bundle);

      return Promise.resolve();
    });
  }

  async listAndCountProducts(
    selector: ListAndCountProductsSelector,
    config: ListAndCountProductsFindConfig = {
      skip: 0,
      take: 10,
    }
  ): Promise<[Product[], number]> {
    const productRepo = this.activeManager_.getRepository(Product);

    // console.log("selector.bundle_id", selector.bundle_id);

    const queryBuilder = productRepo
      .createQueryBuilder("product")
      .leftJoin("product.bundles", "bundle")
      .where("bundle.id = :id", { id: selector.bundle_id })
      .skip(config.skip)
      .take(config.take);

    if (selector.q) {
      queryBuilder.andWhere("product.title ILIKE :q", {
        q: `%${escapeLikeString(selector.q)}%`,
      });
    }

    // console.log("queryBuilder.getQuery()", queryBuilder.getQuery());
    // console.log(
    //   "queryBuilder.getQueryAndParameters()",
    //   queryBuilder.getQueryAndParameters()
    // );

    return queryBuilder.getManyAndCount();

    // what params i need to support: q, limit, offset

    // const query = buildQuery(
    //   {
    //     bundle
    //   },
    //   config
    // );

    // const products = await productRepo.find({ relations: ["bundles"] });

    // Like(`%${selector.q}%`)

    // const products = await productRepo
    //   .createQueryBuilder("product")
    //   .leftJoinAndSelect("product.bundles", "bundle")
    //   .getMany();

    // return products;

    // const questions = await dataSource
    //   .getRepository(Question)
    //   .createQueryBuilder("question")
    //   .leftJoinAndSelect("question.categories", "category")
    //   .getMany();

    // const bundle = await bundleRepo.findOne(query);

    // if (!bundle) {
    //   throw new MedusaError(MedusaError.Types.NOT_FOUND, "Post was not found");
    // }

    // return bundle;
  }

  async listProducts(
    bundleId: string,
    config?: FindConfig<Product>
  ): Promise<Product[]> {
    const productRepo = this.activeManager_.getRepository(Product);

    const query = buildQuery(
      {
        bundleId,
      },
      config
    );

    // const products = await productRepo.find({ relations: ["bundles"] });

    return productRepo
      .createQueryBuilder("product")
      .leftJoin("product.bundles", "bundle")
      .where("bundle.id = :id", { id: bundleId })
      .getMany();

    // const products = await productRepo
    //   .createQueryBuilder("product")
    //   .leftJoinAndSelect("product.bundles", "bundle")
    //   .getMany();

    // return products;

    // const questions = await dataSource
    //   .getRepository(Question)
    //   .createQueryBuilder("question")
    //   .leftJoinAndSelect("question.categories", "category")
    //   .getMany();

    // const bundle = await bundleRepo.findOne(query);

    // if (!bundle) {
    //   throw new MedusaError(MedusaError.Types.NOT_FOUND, "Post was not found");
    // }

    // return bundle;
  }

  async addProducts(bundleId: string, productIds: string[]): Promise<Bundle> {
    return await this.atomicPhase_(async (manager) => {
      const bundleRepo = manager.withRepository(this.bundleRepository_);

      const { id } = await this.retrieve(bundleId, { select: ["id"] });

      await bundleRepo.bulkAddProducts(id, productIds);

      const bundle = await this.retrieve(id, {
        relations: ["products"],
      });

      return bundle;
    });
  }

  async removeProducts(
    bundleId: string,
    productIds: string[]
  ): Promise<Bundle> {
    return await this.atomicPhase_(async (manager) => {
      const bundleRepo = manager.withRepository(this.bundleRepository_);

      const { id } = await this.retrieve(bundleId, { select: ["id"] });

      await bundleRepo.bulkRemoveProducts(id, productIds);

      const bundle = await this.retrieve(id, {
        relations: ["products"],
      });

      return bundle;
    });
  }
}
