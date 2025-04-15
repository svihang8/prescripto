import IDoctor from "../interfaces/doctor.interface";
import DoctorRepository from "../repository/doctor.repository";

class DoctorService {
    private readonly doctorRepository: DoctorRepository;

    constructor() {
        this.doctorRepository = new DoctorRepository();
    }

    async create(data: IDoctor): Promise<IDoctor> {
        return this.doctorRepository.create(data);
    }

    async findByEmail(email:string): Promise<IDoctor | null> {
        return this.doctorRepository.findByEmail(email);
    }
}

export default DoctorService;