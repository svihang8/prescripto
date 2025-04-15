import { Request, Response } from "express";
import Prescription from "../models/prescription.model";
import { generatePrescriptionLabelImage } from "../services/prescription.service";
import DoctorService from "../services/doctor.service";
import PharmacyService from "../services/pharmacy.service";
import IPrescription from "../interfaces/prescription.interface";
import { Types } from "mongoose";
import PatientService from "../services/patient.service";

class PrescriptionController {
    public async create(req: Request, res: Response) {
        try {
            // Handle both single medication and multiple medications
            const prescriptionData = { ...req.body };
            console.log(prescriptionData);
            // // If medications array is provided, use it instead of single medication fields
            // if (prescriptionData.medications && Array.isArray(prescriptionData.medications)) {
            //     // If medications array is provided, we don't need the single medication fields
            //     delete prescriptionData.drugName;
            //     delete prescriptionData.drugStrength;
            //     delete prescriptionData.dosageForm;
            //     delete prescriptionData.quantity;
            //     delete prescriptionData.directionsForUse;
            // } else {
            //     // If single medication is provided, create a medications array
            //     prescriptionData.medications = [{
            //         name: prescriptionData.drugName,
            //         dosage: prescriptionData.drugStrength,
            //         frequency: prescriptionData.dosageForm,
            //         duration: prescriptionData.directionsForUse
            //     }];
            // }
            
            const prescription = new Prescription.model(prescriptionData);
            console.log(prescription)
            await prescription.save();
            res.status(200).json(prescription);
        } catch (error: any) {
            console.log(error)
            res.status(400).json({ error: error.message });
        }
    }

    public async getAll(req: Request, res: Response) {
        try {
            const prescriptions = await Prescription.model.find();
            res.status(200).json(prescriptions);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getById(req: Request, res: Response):Promise<any> {
        try {
            const prescription = await Prescription.model.findById(req.params.id);
            if (!prescription) {
                return res.status(404).json({ error: "Prescription not found" });
            }
            res.status(200).json(prescription);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async update(req: Request, res: Response):Promise<any> {
        try {
            // Handle both single medication and multiple medications
            const prescriptionData = { ...req.body };
            
            // If medications array is provided, use it instead of single medication fields
            if (prescriptionData.medications && Array.isArray(prescriptionData.medications)) {
                // If medications array is provided, we don't need the single medication fields
                delete prescriptionData.drugName;
                delete prescriptionData.drugStrength;
                delete prescriptionData.dosageForm;
                delete prescriptionData.quantity;
                delete prescriptionData.directionsForUse;
            } else if (prescriptionData.drugName) {
                // If single medication is provided, create a medications array
                prescriptionData.medications = [{
                    name: prescriptionData.drugName,
                    dosage: prescriptionData.drugStrength,
                    frequency: prescriptionData.dosageForm,
                    duration: prescriptionData.directionsForUse
                }];
            }
            
            const prescription = await Prescription.model.findByIdAndUpdate(
                req.params.id,
                prescriptionData,
                { new: true }
            );
            if (!prescription) {
                return res.status(404).json({ error: "Prescription not found" });
            }
            res.status(200).json(prescription);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public async delete(req: Request, res: Response):Promise<any> {
        try {
            const prescription = await Prescription.model.findByIdAndDelete(req.params.id);
            if (!prescription) {
                return res.status(404).json({ error: "Prescription not found" });
            }
            res.status(200).json({ message: "Prescription deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getByPatientEmail(req: Request, res: Response):Promise<any> {
        try {
            let prescriptions = await Prescription.model.find({ patientEmail: req.params.email });
            let filtered_prescriptions_promises = prescriptions.map(async (prescriptions) => {
                const doctor = await new DoctorService().findByEmail(prescriptions.doctorEmail);
                const filteredDoctor = {
                    'firstName' : doctor?.firstName,
                    'lastName' : doctor?.lastName,
                    'specialization' : doctor?.specialization,
                    'email' : doctor?.email,
                }
                const pharmacy = await new PharmacyService().findByEmail(prescriptions.pharmacistEmail);
                const filteredPharmacy = {
                    'name': pharmacy?.name,
                    'address': pharmacy?.address,
                    'email': pharmacy?.email
                }
                return {
                    drugName: prescriptions.drugName,
                    drugStrength: prescriptions.drugStrength,
                    dosageForm: prescriptions.dosageForm,
                    quantity: prescriptions.quantity,
                    directionsForUse: prescriptions.directionsForUse,
                    medications: prescriptions.medications,
                    pharmacist: filteredPharmacy,
                    doctor: filteredDoctor,
                };
            })
            res.status(200).json(await Promise.all(filtered_prescriptions_promises));
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getByDoctorEmail(req: Request, res: Response):Promise<any> {
        try {
            const prescriptions = await Prescription.model.find({ doctorEmail: req.params.email });
            let filtered_prescriptions_promises = prescriptions.map(async (prescriptions) => {
                const doctor = await new DoctorService().findByEmail(prescriptions.doctorEmail);
                const pharmacy = await new PharmacyService().findByEmail(prescriptions.pharmacistEmail);
                const filteredPharmacy = {
                    'name': pharmacy?.name,
                    'address': pharmacy?.address,
                    'email': pharmacy?.email
                }
                const patient = await new PatientService().findByEmail(prescriptions.patientEmail);
                const filteredPatient = {
                    'firstName': patient?.firstName,
                    'lastName': patient?.lastName,
                    'address': patient?.address,
                    'email': patient?.email
                }
                return {
                    id: prescriptions.id,
                    drugName: prescriptions.drugName,
                    drugStrength: prescriptions.drugStrength,
                    dosageForm: prescriptions.dosageForm,
                    quantity: prescriptions.quantity,
                    directionsForUse: prescriptions.directionsForUse,
                    medications: prescriptions.medications,
                    pharmacy: filteredPharmacy,
                    patient: filteredPatient,
                };
            })
            res.status(200).json(await Promise.all(filtered_prescriptions_promises));
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getByPharmacistEmail(req: Request, res: Response):Promise<any> {
        try {
            const prescriptions = await Prescription.model.find({ pharmacistEmail: req.params.email });
            let filtered_prescriptions_promises = prescriptions.map(async (prescriptions) => {
                const doctor = await new DoctorService().findByEmail(prescriptions.doctorEmail);
                const filteredDoctor = {
                    'firstName': doctor?.firstName,
                    'lastName': doctor?.lastName,
                    'specialization': doctor?.specialization,
                    'email': doctor?.email,
                }
                const patient = await new PatientService().findByEmail(prescriptions.patientEmail);
                const filteredPatient = {
                    'firstName': patient?.firstName,
                    'lastName': patient?.lastName,
                    'address' : patient?.address,
                    'email': patient?.email
                }
                return {
                    id : prescriptions.id,
                    drugName: prescriptions.drugName,
                    drugStrength: prescriptions.drugStrength,
                    dosageForm: prescriptions.dosageForm,
                    quantity: prescriptions.quantity,
                    directionsForUse: prescriptions.directionsForUse,
                    medications: prescriptions.medications,
                    doctor: filteredDoctor,
                    patient: filteredPatient,
                };
            })
            res.status(200).json(await Promise.all(filtered_prescriptions_promises));
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async generateLabel(req: Request, res: Response):Promise<any> {
        try {
            const prescription = await Prescription.model.findById(req.params.id);
            if (!prescription) {
                return res.status(404).json({ error: "Prescription not found" });
            }
            
            // Get the first medication if medications array exists
            const medication = prescription.medications && prescription.medications.length > 0 
                ? prescription.medications[0] 
                : {
                    name: prescription.drugName,
                    dosage: prescription.drugStrength,
                    frequency: prescription.dosageForm,
                    duration: prescription.directionsForUse
                };
            
            // Generate the label image
            const labelImage = generatePrescriptionLabelImage({
                patientName: prescription.patientEmail.split('@')[0], // Use email username as name
                medicationName: medication.name,
                dosage: medication.dosage,
                instructions: medication.duration,
                doctorName: prescription.doctorEmail.split('@')[0], // Use email username as name
                prescriptionDate: prescription.date ? new Date(prescription.date).toLocaleDateString() : new Date().toLocaleDateString(),
                prescriptionId: (prescription._id as Types.ObjectId).toString()
            });
            
            // Set appropriate headers for image response
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `attachment; filename=prescription_label_${prescription.patientEmail.split('@')[0]}.png`);
            
            // Send the image buffer directly
            res.send(labelImage);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
    
}

export default PrescriptionController; 