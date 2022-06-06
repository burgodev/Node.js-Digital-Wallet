import { Router } from "express";
import UserController from "../../controllers/admin/user-controller";

const user_routes = Router();

const user_controller = new UserController();

user_routes.get("/", user_controller.list.bind(user_controller));
user_routes.post("/all-user-information", user_controller.allUserInformation.bind(user_controller));
user_routes.post("/documents", user_controller.getDocumentsInformation.bind(user_controller));
user_routes.post("/address", user_controller.getAddressInformation.bind(user_controller));

export default user_routes;
