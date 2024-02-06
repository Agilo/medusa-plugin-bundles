import {
  EventBusService,
  FindConfig,
  ProductStatus,
  Selector,
  TransactionBaseService,
  buildQuery,
} from "@medusajs/medusa";
import { MedusaError, isDefined } from "medusa-core-utils";
import { Brackets, In, Repository } from "typeorm";
import { Bundle, BundleStatus } from "../models/bundle";
import { Product } from "../models/product";
import BundleRepository from "../repositories/bundle";
import { escapeLikeString } from "../utils/escape-like-string";

type InjectedDependencies = {
  eventBusService: EventBusService;
  productRepository: Repository<Product>;
  bundleRepository: typeof BundleRepository;
};

export default class BundleService extends TransactionBaseService {
  protected readonly eventBus_: EventBusService;
  protected readonly productRepository_: Repository<Product>;
  protected readonly bundleRepository_: typeof BundleRepository;

  static readonly Events = {
    UPDATED: "bundle.updated",
    CREATED: "bundle.created",
    DELETED: "bundle.deleted",
  };

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
    selector: {
      q?: string;
      status?: "draft" | "published";
      product_id?: string;
      product_status?: ProductStatus[];
      handle?: string[];
    } = {},
    config: {
      skip: number;
      take: number;
    } = {
      skip: 0,
      take: 10,
    }
  ): Promise<[Bundle[], number]> {
    const bundleRepo = this.activeManager_.withRepository(
      this.bundleRepository_
    );

    let qb = bundleRepo
      .createQueryBuilder(`bundle`)
      .orderBy(`bundle.title`, `ASC`)
      .skip(config.skip)
      .take(config.take);

    if (selector.product_id) {
      const productRepo = this.activeManager_.withRepository(
        this.productRepository_
      );
      const products = await productRepo.find({
        where: {
          id: selector.product_id,
          ...(selector.product_status
            ? { status: In(selector.product_status) }
            : {}),
        },
        relations: ["bundles"],
      });
      const bundle_ids = products
        .map((product) => product.bundles.map((bundle) => bundle.id))
        .flat();

      qb.andWhereInIds(bundle_ids);
    }

    if (selector.q) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where(`bundle.title ILIKE :q`, {
            q: `%${escapeLikeString(selector.q)}%`,
          }).orWhere(`bundle.description ILIKE :q`, {
            q: `%${escapeLikeString(selector.q)}%`,
          });
        })
      );
    }

    if (selector.status) {
      qb.andWhere("bundle.status = :status", {
        status: selector.status,
      });
    }

    if (selector.handle) {
      qb.andWhere("bundle.handle = :handle", { handle: selector.handle });
    }

    return qb.getManyAndCount();
  }

  async retrieve(
    id: string,
    selector?: Selector<Bundle>,
    config?: FindConfig<Bundle>
  ): Promise<Bundle> {
    if (!isDefined(id)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"bundleId" must be defined`
      );
    }

    return await this.retrieve_({ ...selector, id }, config);
  }

  async retrieve_(
    selector: Selector<Bundle>,
    config: FindConfig<Bundle>
  ): Promise<Bundle> {
    const bundleRepo = this.activeManager_.withRepository(
      this.bundleRepository_
    );

    const bundle = await bundleRepo.findOne(buildQuery(selector, config));

    if (!bundle) {
      const selectorConstraints = Object.entries(selector)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Bundle with ${selectorConstraints} was not found`
      );
    }

    return bundle;
  }

  async create(data: {
    id?: string;
    title: string;
    handle?: string;
    description?: string;
    status?: BundleStatus;
    thumbnail?: string;
  }): Promise<Bundle> {
    return await this.atomicPhase_(async (manager) => {
      const bundleRepo = manager.withRepository(this.bundleRepository_);

      let bundle = bundleRepo.create(data);
      bundle = await bundleRepo.save(bundle);

      const result = await this.retrieve(bundle.id, {});

      await this.eventBus_
        .withTransaction(manager)
        .emit(BundleService.Events.CREATED, {
          id: result.id,
        });

      return result;
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      handle?: string;
      description?: string;
      status?: BundleStatus;
      thumbnail?: string;
    }
  ): Promise<Bundle> {
    return await this.atomicPhase_(async (manager) => {
      const bundleRepo = manager.withRepository(this.bundleRepository_);

      const bundle = await this.retrieve(id);

      for (const [key, value] of Object.entries(data)) {
        bundle[key] = value;
      }

      const result = await bundleRepo.save(bundle);

      await this.eventBus_
        .withTransaction(manager)
        .emit(BundleService.Events.UPDATED, {
          id: result.id,
        });

      return result;
    });
  }

  async delete(id: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const bundleRepo = manager.withRepository(this.bundleRepository_);

      // Should not fail, if bundle does not exist, since delete is idempotent
      const bundle = await bundleRepo.findOne({
        where: { id },
      });

      if (!bundle) {
        return;
      }

      await bundleRepo.remove(bundle);

      await this.eventBus_
        .withTransaction(manager)
        .emit(BundleService.Events.DELETED, {
          id,
        });

      return Promise.resolve();
    });
  }

  async listAndCountProducts(
    selector: {
      bundle_id: string;
      q?: string;
      status?: ProductStatus;
    },
    config: {
      skip: number;
      take: number;
    } = {
      skip: 0,
      take: 10,
    }
  ): Promise<[Product[], number]> {
    const productRepo = this.activeManager_.withRepository(
      this.productRepository_
    );

    const qb = productRepo
      .createQueryBuilder("product")
      .leftJoin("product.bundles", "bundle")
      .where("bundle.id = :id", { id: selector.bundle_id })
      .orderBy(`product.title`, `ASC`)
      .skip(config.skip)
      .take(config.take);

    if (selector.q) {
      qb.andWhere("product.title ILIKE :q", {
        q: `%${escapeLikeString(selector.q)}%`,
      });
    }

    if (selector.status) {
      qb.andWhere("product.status = :status", {
        status: selector.status,
      });
    }

    return qb.getManyAndCount();
  }

  async listProductIds(id: string): Promise<string[]> {
    const bundleRepo = this.activeManager_.withRepository(
      this.bundleRepository_
    );
    return await bundleRepo.listProductIds(id);
  }

  async addProducts(bundleId: string, productIds: string[]): Promise<Bundle> {
    return await this.atomicPhase_(async (manager) => {
      const bundleRepo = manager.withRepository(this.bundleRepository_);

      const { id } = await this.retrieve(bundleId, {}, { select: ["id"] });

      await bundleRepo.addProducts(id, productIds);

      const result = await this.retrieve(
        id,
        {},
        {
          relations: ["products"],
        }
      );

      await this.eventBus_
        .withTransaction(manager)
        .emit(BundleService.Events.UPDATED, result);

      return result;
    });
  }

  async removeProducts(
    bundleId: string,
    productIds: string[]
  ): Promise<Bundle> {
    return await this.atomicPhase_(async (manager) => {
      const bundleRepo = manager.withRepository(this.bundleRepository_);

      const { id } = await this.retrieve(bundleId, {}, { select: ["id"] });

      await bundleRepo.removeProducts(id, productIds);

      const result = await this.retrieve(
        id,
        {},
        {
          relations: ["products"],
        }
      );

      await this.eventBus_
        .withTransaction(manager)
        .emit(BundleService.Events.UPDATED, result);

      return result;
    });
  }
}
