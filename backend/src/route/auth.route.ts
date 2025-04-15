import AuthController from "../controller/auth.controller";
import { Router } from "express";

class AuthRoute {
    private readonly authController:AuthController;
    public readonly router: Router;

    constructor() {
        this.authController = new AuthController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post("/signup", this.authController.signup.bind(this.authController));

        this.router.post("/signin", this.authController.signin.bind(this.authController));
    }
}

export default new AuthRoute().router;