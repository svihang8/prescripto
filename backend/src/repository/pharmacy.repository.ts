import Pharmacy from "../models/pharmacy.model";
import IPharmacy from "../interfaces/pharmacy.interface";
import GenericRepository from "./generic.repository";

class PharmacyRepository extends GenericRepository<IPharmacy> {
    constructor() {
        super(Pharmacy.model);
    }

    async findByEmail(email: string): Promise<IPharmacy | null> {
        return Pharmacy.model.findOne({ email });
    }
}

export default PharmacyRepository;