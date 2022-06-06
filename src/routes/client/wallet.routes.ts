import { Router } from "express";
import WalletController from "../../controllers/client/wallet-controller";

const wallet_routes = Router();

const wallet_controller = new WalletController();

wallet_routes.get("/address", wallet_controller.getAddress.bind(wallet_controller));
wallet_routes.get("/balance", wallet_controller.getBalance.bind(wallet_controller));

export default wallet_routes;
