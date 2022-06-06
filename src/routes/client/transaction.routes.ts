import { Router } from "express";
import TransactionController from "../../controllers/client/transaction-controller";

const transaction_routes = Router();

const transaction_controller = new TransactionController();

transaction_routes.get("/options", transaction_controller.getTransactionOptions.bind(transaction_controller));
transaction_routes.post("/withdraw", transaction_controller.withdraw.bind(transaction_controller));
transaction_routes.post("/application", transaction_controller.application.bind(transaction_controller));
transaction_routes.post("/rescue", transaction_controller.rescue.bind(transaction_controller));

export default transaction_routes;
