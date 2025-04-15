import mongoose from "mongoose";

interface IPrescription extends mongoose.Document {
    patientEmail: string;
    doctorEmail: string;
    pharmacistEmail: string;
    drugName: string;
    drugStrength: string;
    dosageForm: string;
    quantity: number;
    directionsForUse: string;
    date: Date;
    status?: 'pending' | 'approved' | 'rejected';
    medications?: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
    }>;
}

export default IPrescription;