import { Router } from "express";
import PatientController from "../controller/patient.controller";
import PharmacyController from "../controller/pharmacy.controller";

class PharmacyRoute {
    private readonly pharmacyController: PharmacyController;
    public readonly router: Router;

    constructor() {
        this.pharmacyController = new PharmacyController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get('/', this.pharmacyController.getPharmacies.bind(this.pharmacyController));
    }
}

export default new PharmacyRoute().router;
