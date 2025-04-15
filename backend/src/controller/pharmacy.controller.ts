import { Request, Response, NextFunction } from "express";
import PharmacyService from "../services/pharmacy.service";

class PharmacyController {
    private readonly pharmacyService: PharmacyService;

    constructor() {
        this.pharmacyService = new PharmacyService();
    }

    async getPharmacies(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const pharmacies = await this.pharmacyService.getAllPharmacies();
            const filteredPharmacies = pharmacies.map((pharmacy) => {
                return {
                    name : pharmacy.name,
                    address : pharmacy.address,
                    email : pharmacy.email
                }
            })
            res.status(200).json(filteredPharmacies);
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

export default PharmacyController;