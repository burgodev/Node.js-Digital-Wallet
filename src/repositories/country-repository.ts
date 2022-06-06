import { ICountry } from "../types/country";
import BaseRepository from "./base-repository";

class CountryRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        name: true,
        ddi: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.country);
    }

    public async list(): Promise<ICountry[]> {
        return await this.client.findMany({});
    }
}

export default CountryRepository;
