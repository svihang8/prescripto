import cookieParser from "cookie-parser";
import cors from 'cors';
import Database from "./config/db";
import Swagger from "./utils/swagger";
import express, { Application } from "express";
import ErrorHandler from "./utils/error-handler";
import authRoute from "./route/auth.route";
import prescriptionRoute from "./route/prescription.route";
import dotenv from "dotenv";
import transcriberRoute from "./route/transcriber.route";
import patientRoute from "./route/patient.route";
import pharmacyRoute from "./route/pharmacy.route";

class App {
    private readonly app: Application;
    private readonly port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || "3000");
        this.init();
    }

    private init() {
        this.initConfig();
        this.initMiddlewares(this.getMiddleware());
        this.initRoutes(this.getRouter());
        this.initSwagger();
        this.initErrorHandlers();
    }

    private initConfig() {
        new Database(); // init database
    }

    private getMiddleware() : any[] {
        try {
            if(process.env.ENVIRONMENT_TYPE == "development") {
                return [
                    express.json(),
                    cookieParser(),
                    cors({ origin: process.env.FRONTEND_BASE_URL, credentials: true }),
                ]
            }
            throw new Error(`Environment ${process.env.ENVIRONMENT_TYPE} not recognized`)
        } catch (error) {
            console.error(error);
            return []
        }
    }

    private getRouter() : [string, any][] {
        try {
            if (process.env.ENVIRONMENT_TYPE == "development") {
                return [
                    ["/api/auth", authRoute],
                    ["/api/prescriptions", prescriptionRoute],
                    ["/api/transcribe", transcriberRoute],
                    ["/api/patient", patientRoute],
                    ["/api/pharmacy", pharmacyRoute]
                ]
            }
            throw new Error(`Environment ${process.env.ENVIRONMENT_TYPE} not recognized`)
        } catch (error) {
            console.error(error);
            return []
        }
    }

    private initMiddlewares(middlewares: any[]) {
        middlewares.forEach(middleware => this.app.use(middleware));
    }

    private initRoutes(routers: [string, any][]) {
        routers.forEach(([routePath, route]) => this.app.use(routePath, route));
    }

    private initErrorHandlers() {
        ErrorHandler.getHandlers().forEach(handler => this.app.use(handler));
    }

    private initSwagger() {
        const swagger = new Swagger();
        const [serve, setup] = swagger.initMiddleware();
        this.app.use('/api/docs', serve, setup);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }

}

export default App;