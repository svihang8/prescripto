import IPatient from "../interfaces/patient.interface";
import PatientRepository from "../repository/patient.repository";

class PatientService {
    private readonly patientRepository: PatientRepository;

    constructor() {
        this.patientRepository = new PatientRepository();
    }

    async create(data: IPatient): Promise<IPatient> {
        return this.patientRepository.create(data);
    }

    async findByEmail(email: string): Promise<IPatient | null> {
        return this.patientRepository.findByEmail(email);
    }
}

export default PatientService;