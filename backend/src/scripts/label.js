const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

function generatePrescriptionLabelImage({
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
}) {
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

    const buffer = canvas.toBuffer('image/png');
    const filename = `prescription_label_${patientName.replace(/\s+/g, '_')}.png`;
    fs.writeFileSync(filename, buffer);
    console.log(`✅ Image saved as: ${filename}`);
}

// Example usage
generatePrescriptionLabelImage({
    patientName: "John Doe",
    medicationName: "Amoxicillin",
    dosage: "500mg",
    instructions: "Take 1 tablet every 8 hours for 7 days",
    doctorName: "Jane Smith",
    prescriptionDate: "2025-04-06"
});
