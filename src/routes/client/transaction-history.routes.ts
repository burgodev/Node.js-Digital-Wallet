import { Router } from "express";
import TransactionHistoryController from "../../controllers/client/transaction-history-controller";

const transaction_history_routes = Router();

const transaction_history_controller = new TransactionHistoryController();

transaction_history_routes.get("/", transaction_history_controller.list.bind(transaction_history_controller));
transaction_history_routes.get("/operation-accounts", transaction_history_controller.listLinkedToOA.bind(transaction_history_controller));
transaction_history_routes.get("/wallet", transaction_history_controller.listLinkedToWallet.bind(transaction_history_controller));

export default transaction_history_routes;
