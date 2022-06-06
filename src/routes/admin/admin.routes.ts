import { Router } from "express";
import { hasRole } from "../../middleware/has-role";
import user_routes from "./user.routes";
import document_routes from "./document.routes";
import transaction_request_routes from "./transaction-request.routes";
import transaction_routes from "./transaction.routes";

const admin_routes = Router();

admin_routes.use("/user", user_routes);
admin_routes.use("/document", document_routes);
admin_routes.use("/transaction-request", transaction_request_routes);
admin_routes.use("/transaction", transaction_routes);

export default admin_routes;
