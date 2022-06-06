import { Router } from "express";
import TransactionRequestController from "../../controllers/client/transaction-request-controller";

const transaction_request_routes = Router();

const transaction_request_controller = new TransactionRequestController();

transaction_request_routes.get("/", transaction_request_controller.list.bind(transaction_request_controller));
transaction_request_routes.get("/operation-accounts", transaction_request_controller.listLinkedToOA.bind(transaction_request_controller));
transaction_request_routes.get("/wallet", transaction_request_controller.listLinkedToWallet.bind(transaction_request_controller));

export default transaction_request_routes;
