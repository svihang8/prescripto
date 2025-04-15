import Prescription from "../models/prescription.model";
import IPrescription from "../interfaces/prescription.interface";
import GenericRepository from "./generic.repository";

class PrescriptionRepository extends GenericRepository<IPrescription> {
    constructor() {
        super(Prescription.model);
    }

    async findByPatientEmail(email: string): Promise<IPrescription[]> {
        return Prescription.model.find({ patientEmail: email });
    }
}

export default PrescriptionRepository;