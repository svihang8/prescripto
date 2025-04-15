import mongoose from "mongoose";
import IPharmacy from "../interfaces/pharmacy.interface";

class Pharmacy {
    static schema = new mongoose.Schema(
        {
            name: { type: String, required: true },
            address: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
        },
        { timestamps: true }
    );
    static model = mongoose.model<IPharmacy>("Pharmacy", Pharmacy.schema);
}

export default Pharmacy;