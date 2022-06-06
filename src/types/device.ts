import { DeviceType } from "@prisma/client"

export interface IDevice {
    id?: string,
    mac_address?: string,
    type: string,
    user_role_id: string
}

export interface IDeviceRepository {
    id?: string,
    mac_address?: string,
    type?: DeviceType,
    user_role_id: string
}