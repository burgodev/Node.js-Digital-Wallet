import { IRobot } from "../types/robot";
import BaseRepository from "./base-repository";

class RobotRepository extends BaseRepository {
    
    protected select_arguments = {
        id: true,

        name: true,
        origin: true,
        origin_code: true,
    
        created_at: true,    
    };

    constructor() {
        super();
        this.setClient(this.prisma.Robot);
    }

    public async findByOriginCode(origin_code: string): Promise<IRobot> {
        const ret = await this.client.findFirst({
            where: {
                origin_code
            },
            select: this.select_arguments
        });

        return ret;
    }

}

export default RobotRepository;