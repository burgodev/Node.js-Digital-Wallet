import { Router } from "express";
import { hasRole } from "../../middleware/has-role";
import wallet_routes from "./wallet.routes";
import transaction_request_routes from "./transaction-request.routes";
import transaction_history_routes from "./transaction-history.routes";
import transaction_routes from "./transaction.routes";

const client_routes = Router();

client_routes.use("/wallet", wallet_routes);
client_routes.use("/transaction-request", transaction_request_routes);
client_routes.use("/transaction-history", transaction_history_routes);
client_routes.use("/transaction", transaction_routes);

export default client_routes;
