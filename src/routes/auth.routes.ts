import { Router } from "express";
import AuthController from "../controllers/auth/auth-controller";
import PasswordRecoveryController from "../controllers/auth/password-recovery-controller";
import ClientRegisterController from "../controllers/auth/client-register-controller";
import ManagerRegisterController from "../controllers/auth/manager-register-controller";
import EmailConfirmationController from "../controllers/auth/email-confirmation-controller";

const auth_controller = new AuthController();
const password_recovery_controller = new PasswordRecoveryController();
const client_register_controller = new ClientRegisterController();
const manager_register_controller = new ManagerRegisterController()
const email_confirmation_controller = new EmailConfirmationController()

const AuthRoutes = Router();

AuthRoutes.post("/sign-in", auth_controller.login.bind(auth_controller));
AuthRoutes.post("/request-password-recovery", password_recovery_controller.requestPasswordRecovery.bind(password_recovery_controller));
AuthRoutes.post("/password-recovery", password_recovery_controller.passwordRecovery.bind(password_recovery_controller));
AuthRoutes.get("/acceptance-term", auth_controller.getAcceptanceTerm.bind(auth_controller))

AuthRoutes.post("/client/register", client_register_controller.register.bind(client_register_controller));
AuthRoutes.post("/client/update", client_register_controller.update.bind(client_register_controller));
AuthRoutes.post("/client/documents", client_register_controller.documents.bind(client_register_controller));
AuthRoutes.post("/client/email-confirmation", email_confirmation_controller.validate.bind(email_confirmation_controller));

AuthRoutes.post("/manager/register", manager_register_controller.register.bind(manager_register_controller))
AuthRoutes.post("/manager/request-password", manager_register_controller.resendEmailWithPassword.bind(manager_register_controller))
AuthRoutes.post("/manager/verify_email",manager_register_controller.emailVerification.bind(manager_register_controller))
export default AuthRoutes;
