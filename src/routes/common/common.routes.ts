import { Router } from "express";
import notification_routes from "./notification.routes";

const common_routes = Router();

common_routes.use("/notifications", notification_routes);

export default common_routes;
