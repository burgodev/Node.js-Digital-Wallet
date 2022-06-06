import { Router } from "express";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";
import { hasRole } from "../middleware/has-role";
import AuthRoutes from "./auth.routes";
import CountryRoutes from "./country.routes";
import DocumentTypeRoutes from "./document-types.routes";
import OperationAccountRoutes from "./operation-account.routes";
import UserRoutes from "./user.routes";
import ManagerRoutes from "./manager.routes";
import CommercialRoutes from "./commercial.routes";

import admin_routes from "./admin/admin.routes";
import client_routes from "./client/client.routes";
import common_routes from "./common/common.routes";
import webhook_routes from "./webhooks/webhooks.routes";

const api = Router();

api.get("/test", (req, res) => {
    console.log("Working API");
    res.json({ msg: "Working API: Select Markets" });
});

api.use("/auth", AuthRoutes);
api.use("/country", CountryRoutes);
api.use("/document-type", DocumentTypeRoutes);
api.use("/user", ensureAuthenticated, UserRoutes);
api.use("/manager", ensureAuthenticated, ManagerRoutes);
api.use("/commercial",ensureAuthenticated,hasRole("Business|Admin"), CommercialRoutes);
api.use("/operation-account", ensureAuthenticated, OperationAccountRoutes);

api.use("/admin", ensureAuthenticated, hasRole("Admin|Support|Business"), admin_routes);
api.use("/client", ensureAuthenticated, hasRole("Client"), client_routes);
api.use("/webhook", webhook_routes);
api.use("/", ensureAuthenticated, common_routes);

export default api;
