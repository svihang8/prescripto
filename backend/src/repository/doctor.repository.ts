import Doctor from "../models/doctor.model";
import IDoctor from "../interfaces/doctor.interface";
import GenericRepository from "./generic.repository";

class DoctorRepository extends GenericRepository<IDoctor> {
    constructor() {
        super(Doctor.model);
    }

    async findByEmail(email: string): Promise<IDoctor | null> {
        return Doctor.model.findOne({ email });
    }
}

export default DoctorRepository;