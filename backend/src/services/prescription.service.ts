import IPrescription from "../interfaces/prescription.interface";
import PrescriptionRepository from "../repository/prescription.repository";
import { createCanvas } from 'canvas';

class PrescriptionService {
    private readonly prescriptionRepository: PrescriptionRepository;

    constructor() {
        this.prescriptionRepository = new PrescriptionRepository();
    }

    create(prescription:IPrescription) 
    {
        return this.prescriptionRepository.create(prescription)
    }
}

interface PrescriptionLabelData {
    patientName: string;
    medicationName: string;
    dosage: string;
    instructions: string;
    doctorName: string;
    prescriptionDate: string;
    pharmacyName?: string;
    pharmacyContact?: string;
    refills?: string;
    prescriptionId?: string;
}

export function generatePrescriptionLabelImage({
    patientName,
    medicationName,
    dosage,
    instructions,
    doctorName,
    prescriptionDate,
    pharmacyName = "HealthFirst Pharmacy",
    pharmacyContact = "(555) 123-4567",
    refills = "No refills",
    prescriptionId = "RX123456"
}: PrescriptionLabelData): Buffer {
    const width = 512;
    const height = 256;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(pharmacyName, 20, 30);
    ctx.font = '12px Arial';
    ctx.fillText(`Contact: ${pharmacyContact}`, 20, 50);

    ctx.font = 'bold 14px Arial';
    ctx.fillText('Prescription Label', 20, 75);

    ctx.font = '12px Arial';
    let y = 100;
    const lineHeight = 18;

    const lines = [
        `Patient: ${patientName}`,
        `Medication: ${medicationName} (${dosage})`,
        `Instructions: ${instructions}`,
        `Prescribed by: Dr. ${doctorName}`,
        `Date: ${prescriptionDate}`,
        `Prescription ID: ${prescriptionId}`,
        `Refills: ${refills}`,
    ];

    lines.forEach(line => {
        ctx.fillText(line, 20, y);
        y += lineHeight;
    });

    // Return the buffer instead of saving to file
    return canvas.toBuffer('image/png');
}

export default PrescriptionService;