import { EventBusService, Logger, UserService } from "@medusajs/medusa";

type InjectedDependencies = {
  eventBusService: EventBusService;
  userService: UserService;
  logger: Logger;
};

class ExampleSubscriber {
  private readonly userService: UserService;
  private readonly logger: Logger;

  constructor({ eventBusService, userService, logger }: InjectedDependencies) {
    this.userService = userService;
    this.logger = logger;

    eventBusService.subscribe("bundle.updated", this.handleBundleUpdated);
    eventBusService.subscribe("bundle.created", this.handleBundleCreated);
    eventBusService.subscribe("bundle.deleted", this.handleBundleDeleted);
    // eventBusService.subscribe("user.updated", this.handleUserUpdated);
  }

  handleBundleUpdated = async (data: any) => {
    this.logger.debug("ExampleSubscriber::handleBundleUpdated");
    this.logger.debug(JSON.stringify(data));
  };

  handleBundleCreated = async (data: any) => {
    this.logger.debug("ExampleSubscriber::handleBundleCreated");
    this.logger.debug(JSON.stringify(data));
  };

  handleBundleDeleted = async (data: any) => {
    this.logger.debug("ExampleSubscriber::handleBundleDeleted");
    this.logger.debug(JSON.stringify(data));
  };

  // handleUserUpdated = async (data: any) => {
  //   this.logger.debug("ExampleSubscriber::handleUserUpdated");
  //   this.logger.debug(JSON.stringify(data));

  //   this.userService.retrieve(data.id).then((user) => {
  //     this.logger.debug(JSON.stringify(user));
  //   });
  // };
}

export default ExampleSubscriber;
