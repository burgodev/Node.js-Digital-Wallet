import { jsonToMap, l, mapToJson } from "../helpers/general";
import SocketIO from "socket.io";
import auth from "../helpers/auth";
import cache_client from "../helpers/cache";
import { Server } from "socket.io";
import APIError from "../errors/api-error";

interface ExtSocket extends SocketIO.Socket {
    auth: {
        user_id: string;
        user_role_id: string;
    };
}

export const CACHE_SOCKET_KEY = "SOCKET_LIST";
export type SocketList = Map<string, string>;

class IO {
    private static instance: IO;
    private io: Server;

    private constructor() {}

    public static getInstance(): IO {
        if (!IO.instance) IO.instance = new IO();
        return IO.instance;
    }

    public startup(io: Server): void {
        this.io = io;
        this.io
            .use(async (socket: ExtSocket, next) => {
                try {
                    if (socket.handshake.query && socket.handshake.query.token) {
                        socket.auth = await auth(socket.handshake.query.token.toString());
                        next();
                    }
                } catch (err) {
                    l.error("Error validating token on socket", { message: err.message });
                }
            })
            .on("connection", async (socket: ExtSocket) => {
                const user_role_id = socket.auth.user_role_id;
                l.debug(`New socket connection: ${user_role_id} with id ${socket.id}`);
                await this.saveSocketID(user_role_id, socket.id);

                socket.on("disconnect", async () => {
                    l.debug(`Client ${user_role_id} with id ${socket.id} disconnected from socket`);
                    await this.removeSocketID(socket.auth.user_role_id);
                });
            });
    }

    // * Emmiters

    public async emitTo(user_role_id: string, channel: string, data: any = {}): Promise<void> {
        if (!this.io) throw new APIError("socket.not_started");
        const socket_id = await this.getSocketID(user_role_id);
        if (socket_id) {
            this.io.to(socket_id).emit(channel, data);
        }
    }

    public async walletBalanceChanged(user_role_id: string, balance: number): Promise<void> {
        await this.emitTo(user_role_id, "walletBalanceChanged", { balance });
    }

    public async notification(user_role_id: string, data: { id: string, text: string, datetime: string }): Promise<void> {
        await this.emitTo(user_role_id, "notification", data);
    }

    // * Private functions

    private async getSocketList(): Promise<SocketList> {
        const cache_item = await cache_client.get(CACHE_SOCKET_KEY);
        const socket_list: SocketList = cache_item ? jsonToMap(cache_item) : new Map<string, string>();
        return socket_list;
    }

    private async getSocketID(user_role_id: string): Promise<string> {
        const socket_list = await this.getSocketList();
        const socket_id = socket_list.get(user_role_id);
        // if (!socket_id) throw new Error("User is not connected to socket");
        return socket_id;
    }

    private async saveSocketList(list: SocketList): Promise<void> {
        await cache_client.set(CACHE_SOCKET_KEY, mapToJson(list));
    }

    private async saveSocketID(user_role_id: string, socket_id: string): Promise<void> {
        const socket_list = await this.getSocketList();
        socket_list?.set(user_role_id, socket_id);
        await this.saveSocketList(socket_list);
    }

    private async removeSocketID(user_role_id: string): Promise<void> {
        const socket_list = await this.getSocketList();
        socket_list?.delete(user_role_id);
        await this.saveSocketList(socket_list);
    }
}

export default IO.getInstance();