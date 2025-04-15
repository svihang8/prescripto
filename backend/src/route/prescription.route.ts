import { Router } from "express";
import PrescriptionController from "../controller/prescription.controller";

class PrescriptionRoute {
    private readonly prescriptionController: PrescriptionController;
    public readonly router: Router;

    constructor() {
        this.prescriptionController = new PrescriptionController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        // Create a new prescription
        this.router.post("/", this.prescriptionController.create.bind(this.prescriptionController));

        // Get all prescriptions
        this.router.get("/", this.prescriptionController.getAll.bind(this.prescriptionController));

        // Get prescriptions by patient email
        this.router.get("/patient/:email", this.prescriptionController.getByPatientEmail.bind(this.prescriptionController));

        // Get prescriptions by doctor email
        this.router.get("/doctor/:email", this.prescriptionController.getByDoctorEmail.bind(this.prescriptionController));

        // Get prescriptions by pharmacist email
        this.router.get("/pharmacist/:email", this.prescriptionController.getByPharmacistEmail.bind(this.prescriptionController));

        // Generate prescription label
        this.router.get("/label/:id", this.prescriptionController.generateLabel.bind(this.prescriptionController));

        // Get a specific prescription by ID
        this.router.get("/:id", this.prescriptionController.getById.bind(this.prescriptionController));

        // Update a prescription
        this.router.put("/:id", this.prescriptionController.update.bind(this.prescriptionController));

        // Delete a prescription
        this.router.delete("/:id", this.prescriptionController.delete.bind(this.prescriptionController));
    }
}

export default new PrescriptionRoute().router; 