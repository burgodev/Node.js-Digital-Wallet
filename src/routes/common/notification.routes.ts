import { Router } from "express";
import NotificationController from "../../controllers/common/notification-controller";

const notification_routes = Router();

const notification_controller = new NotificationController();

notification_routes.get("/unreaded", notification_controller.listUnreaded.bind(notification_controller));
notification_routes.post("/readed", notification_controller.readed.bind(notification_controller));
notification_routes.get("/", notification_controller.list.bind(notification_controller));

export default notification_routes;
