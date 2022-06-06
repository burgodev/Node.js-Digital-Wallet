import { IRole } from '../types/role';
import BaseRepository from './base-repository';

class RoleRepository extends BaseRepository {

    protected select_arguments = {
        id: true,
        name: true,
    }

    constructor() {
        super();
        this.setClient(this.prisma.role);
    }

    public async findByName(name: string): Promise<IRole> {
        return await this.client.findFirst({
            where: {
                name,
            },
            select: this.select_arguments,
        });
    }

    public async find(role_id: string): Promise<string> {
        const role = await this.client.findFirst({
            where: {
                id: role_id,
            },
            select: this.select_arguments,
        });

        return role?.name || null;
    }

}

export default RoleRepository;