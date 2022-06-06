import { Router } from "express";

import OperationAccountController from "../controllers/operation-account-controller";
import OperationAccountRepository from "../repositories/operation-account-repository";
import OperationAccountService from "../services/operation-account.service";

const operationAccountRepository = new OperationAccountRepository();
const operationAccountService = new OperationAccountService(operationAccountRepository);
const operationAccountController = new OperationAccountController(operationAccountService);

const operationAccoutnRoutes = Router();

operationAccoutnRoutes.post("/", operationAccountController.create.bind(operationAccountController));
operationAccoutnRoutes.get("/real", operationAccountController.listReals.bind(operationAccountController));
operationAccoutnRoutes.get("/demo", operationAccountController.listDemos.bind(operationAccountController));

export default operationAccoutnRoutes;