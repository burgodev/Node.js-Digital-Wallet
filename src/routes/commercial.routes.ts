import { Router } from "express";
import CommercialController from "../controllers/commercial-controller";

const commercialController = new CommercialController();
const CommercialRoutes = Router();

CommercialRoutes.get("/all-new-users-to-manager",commercialController.listAllNewUsersToManager.bind(commercialController));
CommercialRoutes.get("/all-indications-to-manager-by-managers",commercialController.listAllIndicationsByManagersToManagersAcc.bind(commercialController));
CommercialRoutes.get("/all-status-waiting-managers",commercialController.listAllManagersWaitingStatus.bind(commercialController));
CommercialRoutes.get("/all-clients-to-be-managers",commercialController.listAllClientsWaitingToBeManagers.bind(commercialController));
CommercialRoutes.post("/active-manager",commercialController.activeManager.bind(commercialController));
CommercialRoutes.post("/refuse-manager",commercialController.refuseManager.bind(commercialController));
CommercialRoutes.get("/all-status-waiting-managers-to-be-approved",commercialController.listAllMangersWaitingForValidation.bind(commercialController));
CommercialRoutes.get("/all-clients-and-managers",commercialController.listAllUserWithRoleClientAndManager.bind(commercialController));

export default CommercialRoutes;