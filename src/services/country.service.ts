import CountryRepository from "../repositories/country-repository";
import { ICountry } from "../types/country";

class CountryService {
    private repository: CountryRepository;

    constructor() {
        this.repository = new CountryRepository();
    }

    public async list(): Promise<ICountry[]> {
        return await this.repository.list();
    }
}

export default CountryService;
