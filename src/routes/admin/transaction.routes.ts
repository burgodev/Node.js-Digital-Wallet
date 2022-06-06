import { Router } from "express";
import TransactionController from "../../controllers/admin/transaction-controller";

const transaction_routes = Router();

const transaction_controller = new TransactionController();

transaction_routes.post("/complete", transaction_controller.complete.bind(transaction_controller));
transaction_routes.post("/cancel", transaction_controller.cancel.bind(transaction_controller));

export default transaction_routes;
