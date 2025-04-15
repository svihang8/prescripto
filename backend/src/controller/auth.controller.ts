import { NextFunction } from "express";
import { Request, Response } from "express";
import DoctorService from "../services/doctor.service";
import PatientService from "../services/patient.service";
import PharmacyService from "../services/pharmacy.service";
import IDoctor from "../interfaces/doctor.interface";
import IPatient from "../interfaces/patient.interface";
import IPharmacy from "../interfaces/pharmacy.interface";
import { BcryptService } from "../services/bcrypt.service";
import JwtService from "../services/jwt.service";

enum Role {
    Doctor = "doctor",
    Patient = "patient",
    Pharmacy = "pharmacy"
}

interface SignInRequestBody {
    role : Role,
    data : IDoctor | IPatient | IPharmacy,
}

class AuthController {
    private readonly patientService: PatientService;
    private readonly doctorService: DoctorService;
    private readonly pharmacyService: PharmacyService;
    private readonly bcryptService: BcryptService;
    private readonly tokenService: JwtService;

    constructor() {
        this.patientService = new PatientService();
        this.doctorService = new DoctorService();
        this.pharmacyService = new PharmacyService();
        this.bcryptService = new BcryptService();
        this.tokenService = new JwtService();
    }

    async signup(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            let { role, data } = req.body;
            let user: IDoctor | IPatient | IPharmacy;
            data['password'] = await this.bcryptService.encrypt(data['password']);
            switch(role) {
                case Role.Doctor:
                    user = await this.doctorService.create(data);
                    break;
                case Role.Patient:
                    user = await this.patientService.create(data);
                    break;
                case Role.Pharmacy:
                    user = await this.pharmacyService.create(data);
                    break;
                default:
                    return res.status(400).json({'message' : 'invalid role'})
            }

            const token = this.tokenService.createToken({'email' : user['email']});

            return res.status(200).json({ 'user': user, 'message' : 'user created', 'token' : token});

        } catch (error:unknown) {
            console.log(error);
            return res.status(500).json({ 'message': 'server error', 'error': error });
        }
    }

    async signin(req:Request, res:Response, next:NextFunction): Promise<any> {
        try {
            const { data, role } = req.body;
            if(!data['email'] || !data['password']) {
                return res.status(400).json({'message' : 'username or password not provided'})
            }
            let user;
            switch(role) {
                case Role.Doctor:
                    user = await this.doctorService.findByEmail(data['email']);
                    break;
                case Role.Patient:
                    user = await this.patientService.findByEmail(data['email']);
                    break;
                case Role.Pharmacy:
                    user = await this.pharmacyService.findByEmail(data['email']);
            }
            if(!user) {
                return res.status(400).json({'mesage' : 'user not found'})
            }
            if(!await this.bcryptService.compare(data['password'], user['password'])) {
                return res.status(400).json({'message' : 'invalid password'})
            }

            const token = this.tokenService.createToken({'email' : user['email']});

            res.status(200).json({'user' : user, 'token' : token})
        } catch (error) {
            return res.status(500).json({ 'message': 'server error', 'error': error });
        }
        
    }


}

export default AuthController;