import { Router } from "express";
import { axAuth } from "../../middleware/ax-auth";
import ax_routes from "./ax.routes";
import botmoneyRoutes from "./botmoney.routes";

const webhookRoutes = Router();

webhookRoutes.use("/botmoney", botmoneyRoutes);
webhookRoutes.use("/ax", ax_routes);
// webhook_routes.use("/ax", axAuth, ax_routes);

export default webhookRoutes;
