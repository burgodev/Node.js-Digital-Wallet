import { prisma } from "../helpers/db";
import { Paginate } from "../types/common";

export default class BaseRepository<T = any> {
    protected prisma;
    protected client: any;

    protected select_arguments = {};
    protected where_not_deleted = {
        // deleted_at: null
    };

    constructor() {
        this.prisma = prisma;
    }

    protected setClient(client: unknown): void {
        this.client = client;
    }

    protected async paginate(config: any, take: number, skip: number): Promise<Paginate<T>> {
        const [ list, count ] = await this.prisma.$transaction([
            (
                this.client.findMany({
                    ...config,
                    skip,
                    take,
                })
            ),
            (
                this.client.count({
                    where: config?.where || {}
                })
            )
        ]);

        const pages = Math.ceil(count / take);

        return {
            list,
            pages,
        };
    }

}