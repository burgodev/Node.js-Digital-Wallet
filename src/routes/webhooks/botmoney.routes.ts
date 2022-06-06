import { BotmoneyController } from "../../controllers/botmoney-controller";
import { Router } from "express";
import { botmoneyAuthentication } from "../../middleware/botmoney-authentication";
import { ensureAuthenticated } from "../../middleware/ensure-authenticated";

const botmoneyController = new BotmoneyController();

// Warning!
// Firewall blocks botmoney routes with get method
// We solve this by changing to post method
const botmoneyRoutes = Router();

botmoneyRoutes.post("/token-validation", botmoneyController.checkTokenIntegration.bind(botmoneyController));
botmoneyRoutes.post("/list-operation-account", botmoneyAuthentication, botmoneyController.listOperationAccounts.bind(botmoneyController));
botmoneyRoutes.post("/start-robot-request", botmoneyAuthentication, botmoneyController.startRobotRequest.bind(botmoneyController));
botmoneyRoutes.post("/stop-robot-request", botmoneyAuthentication, botmoneyController.stopRobotRequest.bind(botmoneyController));
botmoneyRoutes.post("/synchronize-account", botmoneyAuthentication, botmoneyController.synchronizeAccount.bind(botmoneyController));

botmoneyRoutes.get("/integration-token", ensureAuthenticated, botmoneyController.getIntegrationToken.bind(botmoneyController));

export default botmoneyRoutes;