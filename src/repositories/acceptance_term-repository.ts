import { AcceptanceTerm } from "../types/acceptance-term";
import BaseRepository from "./base-repository";

class AcceptanceTermsRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        is_active: true,
        content: true,
        created_by:true,
        updated_by:true,
        acceptance_term_id:true
    }; 

    constructor() {
        super();
        this.setClient(this.prisma.AcceptanceTerm);
    }

    public async list():Promise<AcceptanceTerm[]> {
        return await this.client.findMany({});
    }
}

export default AcceptanceTermsRepository;
