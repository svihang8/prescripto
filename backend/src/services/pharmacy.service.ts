import IPharmacy from "../interfaces/pharmacy.interface";
import PharmacyRepository from "../repository/pharmacy.repository";

class PharmacyService {
    private readonly pharmacyRepository: PharmacyRepository;

    constructor() {
        this.pharmacyRepository = new PharmacyRepository();
    }

    async getAllPharmacies() {
        return this.pharmacyRepository.findAll();
    }

    async create(data: IPharmacy) {
        return this.pharmacyRepository.create(data);
    }

    async findByEmail(email: string): Promise<IPharmacy | null> {
        return this.pharmacyRepository.findByEmail(email);
    }
}

export default PharmacyService;