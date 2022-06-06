import BaseRepository from "./base-repository";
import { AcceptanceTerms } from "../types/user";

class AcceptanceTermHistoriesRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        accepted: true,
        user_id: true,
        acceptance_term_id: true,
        date: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.AcceptanceTermHistory);
    }

    public async create(data: AcceptanceTerms) {
        return await this.client.create({
            data,
            select: this.select_arguments,
        });
    }
}

export default AcceptanceTermHistoriesRepository;
