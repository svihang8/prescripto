import mongoose from "mongoose";
import IPatient from "../interfaces/patient.interface";

class Patient {
    static schema = new mongoose.Schema(
        {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            address: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
        },
        { timestamps: true }
    );
    static model = mongoose.model<IPatient>("Patient", Patient.schema);
}

export default Patient;