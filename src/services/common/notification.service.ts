import { Notification } from "@prisma/client";
import NotificationRepository from "../../repositories/common/notification-repository";
import IO from "../../helpers/io";
import APIError from "../../errors/api-error";
import { formatDateToDB, t } from "../../helpers/general";
import { Paginate } from "../../types/common";

class NotificationService {

    private repository: NotificationRepository;

    constructor() {
        this.repository = new NotificationRepository();
    }

    public static async create(user_role_id: string, text: string, dont_translate: boolean = false): Promise<Notification> {
        text = dont_translate ? text : t(text);

        const notification = await new NotificationRepository().create({
            datetime: formatDateToDB(new Date()),
            text_args: text,
            text_key: "",
            subject_args: "",
            subject_key: "",
            userRole: {
                connect: {
                    id: user_role_id,
                }
            }
        });

        if (!notification) throw new APIError("notification.create.error");
        
        IO.notification(user_role_id, {
            text,
            id: notification.id,
            datetime: notification.datetime.toDateString(),
        });

        return notification;
    }

    public async readed(notifications: string[]): Promise<void> {
        await this.repository.readed(notifications);
    }

    public async list(user_role_id: string, skip: number, take: number): Promise<Paginate<Notification>> {
        const notifications = await this.repository.list(user_role_id, skip, take);
        return notifications;
    }

    public async listUnreaded(user_role_id: string, skip: number, take: number): Promise<Paginate<Notification>> {
        const notifications = await this.repository.listUnreaded(user_role_id, skip, take);
        return notifications;
    }

}

export default NotificationService;