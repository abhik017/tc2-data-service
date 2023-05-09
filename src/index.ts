import Server from "@abhik017/tc2-express-server";
import { Express } from "express";
import routes from "./api/routes/routes";
const PORT: number = 8081;

export class ServerService {
    getServer() {
        return new Server((app: Express) => routes(app), PORT);
    }

    async startServer() {
        const server = this.getServer();
        await server.launchServer();
    }
};

const serverService = new ServerService();
serverService.startServer().catch(err => console.log("Failed to start the server." + err.toString()));