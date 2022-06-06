import { IRejectReason } from '../../types/reject-reason';
import BaseRepository from '../base-repository';

class RejectReasonRepository extends BaseRepository {

    protected select_arguments = {
        id: true,
        description: true,
    }

    constructor() {
        super();
        this.setClient(this.prisma.rejectReason);
    }

    public async create(description: string): Promise<IRejectReason> {
        return await this.client.create({
            data: {
                description,
            },
            select: this.select_arguments,
        });
    }

}

export default RejectReasonRepository;