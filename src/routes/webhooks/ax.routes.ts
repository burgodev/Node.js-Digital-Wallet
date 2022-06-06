import { Router } from "express";
import AxController from "../../controllers/client/ax-controller";

const ax_routes = Router();

const ax_controller = new AxController();

ax_routes.post("/", ax_controller.proccess.bind(ax_controller));

export default ax_routes;
