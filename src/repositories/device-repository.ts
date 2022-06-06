import { DeviceType } from "@prisma/client";
import ValidationError from "../errors/validation-error";
import { IDevice, IDeviceRepository } from "../types/device";
import BaseRepository from "./base-repository";

class DeviceRepository extends BaseRepository {
    protected select_arguments = {
        id: true,

        mac_address: true,
        type: true,

        user_role_id: true
    };

    constructor() {
        super();
        this.setClient(this.prisma.device);
    }

    public async create(device: IDevice): Promise<IDevice> {
        const { type, ...rest_device } = device;
        let device_type: DeviceType = this.castStringToDeviceType(type);
        
        const new_device: IDeviceRepository = {
            ...rest_device,
            type: device_type
        }

        return await this.client.create({
            data: new_device,
            select: this.select_arguments
        });
    }

    public async getDeviceByMac(mac_address: string, user_role_id: string): Promise<IDevice> {
        return await this.client.findFirst({
            where: {
                mac_address,
                user_role_id
            },
            select: this.select_arguments
        });
    }

    public async getDeviceWithoutMacByType(type: string, user_role_id: string): Promise<IDevice> {
        return await this.client.findFirst({
            where: {
                type,
                mac_address: null,
                user_role_id
            },
            select: this.select_arguments
        });
    }

    private castStringToDeviceType(type: string): DeviceType {
        if (type === "DESKTOP") {
            return DeviceType.DESKTOP;
        } else if (type === "TABLET") {
            return DeviceType.TABLET;
        } else if (type === "SMARTPHONE") {
            return DeviceType.SMARTPHONE;
        }

        throw new ValidationError("device.error.invalid_device_type");
    }

}

export default DeviceRepository;