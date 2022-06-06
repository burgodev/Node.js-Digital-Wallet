import { Router } from "express";
import ManagerController from "../controllers/manager-controller";

const managerController = new ManagerController();
const ManagerRoutes = Router();

ManagerRoutes.get("/link-to-someone-become-client", managerController.generateLinkToUserWithoutAccountBecomeClient.bind(managerController));
ManagerRoutes.get("/link-to-client-become-manager", managerController.generateLinkToClientBecomeManager.bind(managerController));
ManagerRoutes.get("/link-to-someone-become-manager", managerController.generateLinkToUserWithoutAccountBecomeManager.bind(managerController));
ManagerRoutes.get("/list-indications",managerController.listIndications.bind(managerController))
export default ManagerRoutes;
