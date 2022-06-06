import { IAddress } from "../types/address";
import BaseRepository from "./base-repository";

class AddressRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        cep: true,
        number: true,
        street: true,
        city: true,
        state: true,
        country_id: true,
        neighborhood: true,
        complement: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.address);
    }

    public async getUserAddres(user_id: string): Promise<IAddress> {
        return await this.client.findFirst({
            where: {
                user_id,
            },
            select: this.select_arguments,
        });
    }

    public async create(data: IAddress): Promise<IAddress> {
        data = this.formatAddress(data);
        return await this.client.create({
            data,
            select: this.select_arguments,
        });
    }

    public async update(id: string, data: IAddress): Promise<IAddress> {
        data = this.formatAddress(data);
        return await this.client.update({
            where: {
                id,
            },
            data,
            select: this.select_arguments,
        });
    }

    private formatAddress(data: IAddress): IAddress {
        return {
            ...data,
            number: Number(data.number),
        }
    }
}

export default AddressRepository;
