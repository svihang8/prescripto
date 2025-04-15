import Patient from "../models/patient.model";
import IPatient from "../interfaces/patient.interface";
import GenericRepository from "./generic.repository";

class PatientRepository extends GenericRepository<IPatient> {
    constructor() {
        super(Patient.model);
    }

    async findByEmail(email: string): Promise<IPatient | null> {
        return Patient.model.findOne({ email });
    }
}

export default PatientRepository;

