import { Response, Request } from 'express';
import { paginationParams, r } from '../../helpers/general';
import NotificationService from '../../services/common/notification.service';

class NotificationController {

    private service: NotificationService;

    constructor() {
        this.service = new NotificationService();
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const { take, skip } = paginationParams(req);

        const notifications = await this.service.list(user_role_id, skip, take);

        return r(res, 'notification.list', notifications);
    }

    public async listUnreaded(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const { take, skip } = paginationParams(req);

        const notifications = await this.service.listUnreaded(user_role_id, skip, take);

        return r(res, 'notification.unreaded', notifications);
    }

    public async readed(req: Request, res: Response): Promise<Response> {
        const { notifications } = req.body;
        await this.service.readed(notifications);
        return r(res, 'notification.readed');
    }

}

export default NotificationController;