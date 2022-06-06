import { Router } from "express";
import TransactionRequestController from "../../controllers/admin/transaction-request-controller";

const transaction_request_routes = Router();

const transaction_request_controller = new TransactionRequestController();

transaction_request_routes.get("/", transaction_request_controller.list.bind(transaction_request_controller));

export default transaction_request_routes;
