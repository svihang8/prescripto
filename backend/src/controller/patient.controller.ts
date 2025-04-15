import { Request, Response, NextFunction } from "express";
import PatientService from "../services/patient.service";

class PatientController {
    private readonly patientService: PatientService;

    constructor() {
        this.patientService = new PatientService();
    }

    async getPatient(req:Request<{email: string}>, res:Response, next:NextFunction):Promise<any> {
        try {
            const { email } = req.params;
            console.log(email);
            const patient = await this.patientService.findByEmail(email);
            if(!patient) {
                return res.status(404).json({'message' : 'user not found'})
            }
            res.json({
                'firstName' : patient?.firstName,
                'lastName' : patient?.lastName,
                'address' : patient?.address,
                'email' : patient?.email,
            });
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

export default PatientController;