import { Response, Request } from "express";
import { r } from "../helpers/general";
import CountryService from "../services/country.service";

class CountryController {
    private service: CountryService;

    constructor() {
        this.service = new CountryService();
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const countries = await this.service.list();
        return r(res, "country.list", countries);
    }
    
}

export default CountryController;
