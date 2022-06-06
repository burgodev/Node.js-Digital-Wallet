import { Router } from "express";
import DocumentController from "../../controllers/admin/document-controller";

const document_routes = Router();

const document_controller = new DocumentController();

document_routes.post("/approve", document_controller.approve.bind(document_controller));
document_routes.post("/reprove", document_controller.reprove.bind(document_controller));

export default document_routes;
