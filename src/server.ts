import "dotenv/config";
import "express-async-errors";
import http from "http";
import app from "./config/app";
import { l } from "./helpers/general";
import { Server } from "socket.io";
import IO from "./helpers/io";

const serverHttp = http.createServer(app);

// * Socket startup
export const io = new Server(serverHttp, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS", "PUT"],
    },
});
IO.startup(io);

const port = process.env.PORT || 80;
serverHttp.listen(port, () => l.info(`Server is running on PORT ${port}`));
