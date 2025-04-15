import mongoose from "mongoose";
import IPrescription from "../interfaces/prescription.interface";

class Prescription {
    static schema = new mongoose.Schema(
        {
            patientEmail: { type: String, required: true },
            doctorEmail: { type: String, required: true },
            pharmacistEmail: { type: String, required: true },
            drugName: { type: String, required: true },
            drugStrength: { type: String, required: true },
            dosageForm: { type: String, required: true },
            quantity: { type: Number, required: true },
            directionsForUse: { type: String, required: true },
            date: { type: Date, default: Date.now },
            status: { 
                type: String, 
                enum: ['pending', 'approved', 'rejected'],
                default: 'pending'
            },
            medications: [{
                name: { type: String },
                dosage: { type: String },
                frequency: { type: String },
                duration: { type: String }
            }]
        },
        { timestamps: true }
    );
    static model = mongoose.model<IPrescription>("Prescription", Prescription.schema);
}

export default Prescription