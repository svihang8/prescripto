import mongoose from "mongoose";
import IDoctor from "../interfaces/doctor.interface";

class Doctor {
    static schema = new mongoose.Schema(
        {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            specialization: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: {type: String, required: true},
        },
        { timestamps: true }
    );
    static model = mongoose.model<IDoctor>("Doctor", Doctor.schema);
}

export default Doctor;