import { tsNullKeyword } from "@babel/types";
import ActionLogRepository from "../repositories/action-log-repository";
import DeviceRepository from "../repositories/device-repository";
import { ILogInfosRequest } from "../types/action-log";
import { IDevice } from "../types/device";

class ActionLogService {
    private actionLogRepository: ActionLogRepository;
    private deviceRepository: DeviceRepository;

    constructor() {
        this.actionLogRepository = new ActionLogRepository();
        this.deviceRepository = new DeviceRepository();
    }

    public async login(log_infos: ILogInfosRequest, user_role_id: string) {
        let device_id = null;

        if (log_infos.device_type) {
            const device: IDevice = await this.createOrGetUserDevice(user_role_id, log_infos);
            device_id = device.id;
        }

        await this.actionLogRepository.create(user_role_id, "LOGIN", log_infos.ip, device_id);
    }

    public async getLoginsByUserRole(user_role_id: string) {
        return await this.actionLogRepository.getByUserRole(user_role_id, "LOGIN");
    }

    private async createOrGetUserDevice(user_role_id: string, log_infos: ILogInfosRequest): Promise<IDevice> {
        let device;

        if (log_infos.mac_address) {
            device = await this.deviceRepository.getDeviceByMac(log_infos.mac_address, user_role_id);
        } else if (log_infos.device_type) {
            // without mac we create a device with only the type
            // checking it is there already a device with that type. Ex:(mac: null, type: DESKTOP)
            device = await this.deviceRepository.getDeviceWithoutMacByType(log_infos.device_type, user_role_id);
        }

        if (!device) {
            // if is the first time with this device
            const new_device: IDevice = {
                mac_address: log_infos.mac_address,
                type: log_infos.device_type,
                user_role_id,
            };
            device = await this.deviceRepository.create(new_device);
        }

        return device;
    }
}

export default ActionLogService;
