// import { ConfigModule, EventBusService } from "@medusajs/admin";
// import { IEventBusService, Logger } from "@medusajs/types";
import { EventBusService, UserService, Logger } from "@medusajs/medusa";

type InjectedDependencies = {
  eventBusService: EventBusService;
  userService: UserService;
  logger: Logger;
};

class HelloSubscriber {
  private readonly userService: UserService;
  private readonly logger: Logger;

  constructor({ eventBusService, userService, logger }: InjectedDependencies) {
    logger.debug("HelloSubscriber::constructor");

    this.userService = userService;
    this.logger = logger;

    // eventBusService.subscribe("order.placed", this.handleOrder);
    eventBusService.subscribe("user.updated", this.handleUserUpdated);
  }

  // handleOrder = async (data) => {
  //   console.log("HelloSubscriber::handleOrder", data);
  // };

  handleUserUpdated = async (data) => {
    this.logger.debug("HelloSubscriber::handleUserUpdated");
    this.logger.debug(JSON.stringify(data));

    this.userService.retrieve(data.id).then((user) => {
      this.logger.debug(JSON.stringify(user));
    });
  };
}

export default HelloSubscriber;
