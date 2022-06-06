import { formatDateToDB } from "../helpers/general";
import { IUser, ICreateUser, IUpdateUser } from "../types/user";
import BaseRepository from "./base-repository";

class UserRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        email: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.user);
    }

    public async create(data: ICreateUser): Promise<IUser> {
        return await this.client.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                nationality_id: data.nationality_id,
            },
            select: this.select_arguments,
        });
    }

    public async update(id: string, data: IUpdateUser): Promise<IUser> {
        
        return await this.client.update({
            where: {
                id,
            },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                birth_date: formatDateToDB(data.birth_date),
                phone_number: data.phone_number,
                document_number:data.document_number
            },
            select: this.select_arguments,
        });
    }

    public async getByEmail(email: string): Promise<IUser> {
        return await this.client.findFirst({
            where: {
                email,
            },
            select: {
                ...this.select_arguments,
                first_name: true,
                last_name: true,
                document_number: true,
                email_checked_at: true,
            },
        });
    }

    public async find(user_id: string): Promise<IUser> {
        const user = await this.client.findUnique({
            where: {
                id: user_id,
            },
            select: {
                first_name: true,
                email: true,
                last_name: true,
                phone_number: true,
                birth_date: true,
                document_number: true,
                addresses: {
                    select: {
                        id: true,
                        cep: true,
                        number: true,
                        street: true,
                        city: true,
                        state: true,
                        country_id: true,
                        neighborhood: true,
                        complement: true,
                    },
                },
            },
        });

        // ! This is done because users can have many addresses in DB but only one in front(for now)
        if (user.addresses.length > 0) {
            user.address = user.addresses[0];
        }
        delete user.addresses;

        return user;
    }

    public async emailChecked(user_id: string): Promise<void> {
        await this.client.update({
            where: {
                id: user_id,
            },
            data: {
                email_checked_at: formatDateToDB(new Date()),
            },
            select: {
                email: true,
            }
        })
    }
}

export default UserRepository;
