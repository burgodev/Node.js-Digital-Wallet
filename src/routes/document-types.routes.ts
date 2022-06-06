import { Router } from "express";
import DocumentTypeController from "../controllers/document-type-controller";

const documentTypeController = new DocumentTypeController();
const DocumentTypeRoutes = Router();

DocumentTypeRoutes.get("/", documentTypeController.list.bind(documentTypeController));

export default DocumentTypeRoutes;
