import { Prisma, Notification } from '@prisma/client';
import BaseRepository from '../base-repository';
import { Paginate } from "../../types/common";

class NotificationRepository extends BaseRepository {

    protected select_arguments = {
        id: true,
        subject_key: true,
        subject_args: true,
        text_key: true,
        text_args: true,
        datetime: true,
        is_read: true,
        user_role_id: true,
    }

    constructor() {
        super();
        this.setClient(this.prisma.notification);
    }

    public async create(data: Prisma.NotificationCreateInput): Promise<Notification> {
        return await this.client.create({
            data,
            select: this.select_arguments,
        });
    }

    public async readed(notifications: string[]): Promise<void> {
        await this.client.updateMany({
            where: {
                id: {
                    in: notifications,
                },
            },
            data: {
                is_read: true,
            },
        });
    }

    public async list(user_role_id: string, skip: number, take: number): Promise<Paginate<Notification>> {
        return await this.paginate({
            select: this.select_arguments,
            where: {
                user_role_id,
            },
            orderBy: {
              datetime: 'desc',
            },
        }, take, skip);
    }

    public async listUnreaded(user_role_id: string, skip: number, take: number): Promise<Paginate<Notification>> {
        return await this.paginate({
            select: this.select_arguments,
            where: {
                user_role_id,
                is_read: false,
            },
            orderBy: {
              datetime: 'desc',
            },
        }, take, skip);
    }

}

export default NotificationRepository;