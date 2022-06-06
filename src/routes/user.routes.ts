import { Router } from "express";
import ProfileController from "../controllers/user/profile-controller";

const profile_controller = new ProfileController();
const UserRoutes = Router();

UserRoutes.post("/profile/change-password", profile_controller.changePassword.bind(profile_controller));
UserRoutes.post("/profile/update", profile_controller.update.bind(profile_controller));
UserRoutes.post("/profile/upload-documents", profile_controller.documents.bind(profile_controller));
UserRoutes.get("/profile/documents", profile_controller.getDocuments.bind(profile_controller));
UserRoutes.get("/profile/", profile_controller.getData.bind(profile_controller));
UserRoutes.get("/profile/get-integration-token", profile_controller.getIntegrationToken.bind(profile_controller));

export default UserRoutes;
