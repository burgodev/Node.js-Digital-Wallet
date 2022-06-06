import { Router } from "express";
import CountryController from "../controllers/country-controller";

const countryController = new CountryController();
const CountryRoutes = Router();

CountryRoutes.get("/", countryController.list.bind(countryController));

export default CountryRoutes;
