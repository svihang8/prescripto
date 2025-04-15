import { Router } from "express";
import PatientController from "../controller/patient.controller";

class PrescriptionRoute {
    private readonly patientController: PatientController;
    public readonly router: Router;

    constructor() {
        this.patientController = new PatientController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get('/:email', this.patientController.getPatient.bind(this.patientController));
    }
}

export default new PrescriptionRoute().router;
