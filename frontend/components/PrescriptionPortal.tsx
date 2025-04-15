"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem, SelectContent } from '@/components/ui/select';
import { StringMappingType } from 'typescript';
import axios, { AxiosResponse } from 'axios';
import { error } from 'console';
import { get } from 'http';
import { FaLeaf } from 'react-icons/fa';

interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
}

interface Prescription {
    drugName: string;
    drugStrength: string;
    dosageForm: string;
    quantity: number;
    directionsForUse: string;
    medications: Medication[];
}

interface PatientPrescriptions {
    drugName: string;
    drugStrength: string;
    dosageForm: string;
    quantity: number;
    directionsForUse: string;
    medications: Medication[];
    pharmacist: Pharmacist,
    doctor: Doctor,
}

interface DoctorPrescriptions {
    drugName: string;
    drugStrength: string;
    dosageForm: string;
    quantity: number;
    directionsForUse: string;
    medications: Medication[];
    patient: Patient,
    pharmacist: Pharmacist,
}

interface PharmacistPrescriptions {
    id : string,
    drugName: string;
    drugStrength: string;
    dosageForm: string;
    quantity: number;
    directionsForUse: string;
    medications: Medication[];
    patient: Patient,
    doctor: Doctor,
}

interface Patient {
    firstName : string,
    lastName : string,
    address : string,
    email : string,
}

interface Pharmacist {
    name : string,
    address : string,
    email : string
}

interface Doctor {
    firstName : string,
    lastName : string,
    specialization : string,
    email : string,
}

interface Patient {
    firstName: string,
    lastName: string,
    address: string,
    email: string,
}


export default function PrescriptionPortal() {
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

    const [patientPrescriptions, setPatientPrescriptions] = useState<PatientPrescriptions[]>([]);
    const [selectPatientPrescription, setSelectPatientPrescription] = useState<PatientPrescriptions | null>(null);

    const [pharmacistPrescriptions, setPharmacistPrescriptions] = useState<PharmacistPrescriptions[]>([]);
    const [selectPharmacistPrescription, setSelectPharmacistPrescription] = useState<PharmacistPrescriptions | null>(null);

    const [doctorPrescriptions, setDoctorPrescriptions] = useState<DoctorPrescriptions[]>([]);
    const [selectDoctorPrescription, setSelectDoctorPrescription] = useState<DoctorPrescriptions | null>(null);

    const [newPrescription, setNewPrescription] = useState<boolean>(false);
    const [newPatient, setNewPatient] = useState<Patient | null>(null);

    const [prescriptionList, setPrescriptionList] = useState<Prescription[]>([]);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [transcription, setTranscription] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [pharmacies, setPharmacies] = useState<Pharmacist[]>([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState('')
    const email = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    useEffect(() => {
        if(role == 'doctor') {
            const getPrescriptions = async () => {
                const response = await axios.get(
                    `http://localhost:3001/api/prescriptions/doctor/${email}`
                )
                const doctorPrescriptions = response.data;
                console.log('Doctor Prescription Data', doctorPrescriptions);
                setDoctorPrescriptions([...doctorPrescriptions]);
            };

            const getPharmacies = async () => {
                const response = await axios.get(
                'http://localhost:3001/api/pharmacy'
                )
                console.log(`Pharmacies`, response.data)
                setPharmacies([...response.data]);
                console.log(pharmacies);
            }
            getPrescriptions().catch(error => console.error(error));
            getPharmacies().catch(error => console.error(error)); 
        }
        if(role == 'patient') {
            const getPrescriptions = async () => {
                const response = await axios.get(
                    `http://localhost:3001/api/prescriptions/patient/${email}`
                )
                const patientPrescriptions = response.data;
                console.log('Patient Prescription Data', patientPrescriptions);
                setPatientPrescriptions([...patientPrescriptions]);
            }
            getPrescriptions().catch(error => console.error(error));
        }
        if(role == 'pharmacist') {
            const getPrescriptions = async () => {
                const response = await axios.get(
                    `http://localhost:3001/api/prescriptions/pharmacist/${email}`
                )
                console.log('Pharmacist Prescriptions', response.data)
                setPharmacistPrescriptions(response.data);
            }
            getPrescriptions().catch(error => console.error(error));
        }
    },[])

    const handlePharmacyChange = (event:any) => {
        setSelectedPharmacy(event.target.value); // Update the selected pharmacy
    };

    useEffect(() => {
        const getPrescription = async () => {
            try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions', // Use the chat completions endpoint
                {
                    model: 'gpt-3.5-turbo', // Choose the appropriate model (gpt-3.5-turbo or gpt-4)
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant.',
                        },
                        {
                            role: 'user',
                            content: `
              Parse the following text to extract the drug information including:
              - drugName (string)
              - drugStrength (string)
              - dosageForm (string)
              - quantity (number)
              - directionsForUse (string)
              - medications (array with name, dosage, frequency, duration)
              Text: "${transcription}"
              The response should be a JSON object like:
            {
              "drugName": "string",
              "drugStrength": "string",
              "dosageForm": "string",
              "quantity": number,
              "directionsForUse": "string",
              "medications": [{
                "name": "string",
                "dosage": "string",
                "frequency": "string",
                "duration": "string"
              }]
            }
              If you are unsure about the details, just replace with the empty string.
            `,
                        },
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Authorization': `Bearer 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`, // Replace with your actual API key
                        'Content-Type': 'application/json',
                    },
                }
            );
            let prescription:string = response.data.choices[0].message.content;
            console.log(JSON.parse(prescription))
            setSelectedPrescription(JSON.parse(prescription));
            console.log(selectedPrescription)
        } catch(error) {
            console.error(error)
            setSelectedPrescription(null)
        }
        }
        getPrescription().catch(error => console.error(error));
    }, [transcription])

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = event => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            try {
                const response = await axios.post('http://localhost:3001/api/transcribe', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Upload success:', response.data);
                setTranscription(response.data.transcription);
            } catch (error) {
                console.error('Upload failed:', error);
            }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);

    };

    const handleSelectPrescription = (prescription:Prescription) => {
        setSelectedPrescription(prescription);
    };

    const handleSelectPatientPrescription = (prescription:PatientPrescriptions) => {
        setSelectPatientPrescription(prescription);
    };

    const handleSelectPharmacistPrescription = (prescription:PharmacistPrescriptions) => {
        setSelectPharmacistPrescription(prescription);
    }

    const handleSelectDoctorPrescription = (prescription:DoctorPrescriptions | null, isNew:boolean) => {
        setSelectDoctorPrescription(prescription);
        setNewPrescription(isNew);
    };

    const handlePatientSearch = async () => {
        try {
            const data:AxiosResponse<Patient> = await axios({
                method: 'get',
                url: `api/patient/${searchQuery}`,
                baseURL: 'http://localhost:3001',
            });
            let patient:Patient = data.data;
            setNewPatient(patient);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSavePrescription = async () => {
        try {
            console.log(selectedPrescription)
            console.log(JSON.stringify({
                "patientEmail": newPatient?.email,
                "doctorEmail": email,
                "pharmacistEmail": selectedPharmacy,
                drugName: selectedPrescription?.drugName,
                drugStrength: selectedPrescription?.drugStrength,
                dosageForm: selectedPrescription?.dosageForm,
                quantity: selectedPrescription?.quantity,
                directionsForUse: selectedPrescription?.directionsForUse,
                medications: selectedPrescription?.medications,
            }))
            await axios.post('http://localhost:3001/api/prescriptions', {
                "patientEmail" : newPatient?.email,
                "doctorEmail" : email,
                "pharmacistEmail" : selectedPharmacy,
                drugName: selectedPrescription?.drugName || "",
                drugStrength: selectedPrescription?.drugStrength || "",
                dosageForm: selectedPrescription?.dosageForm || "",
                quantity: selectedPrescription?.quantity || "",
                directionsForUse: selectedPrescription?.directionsForUse || "",
                medications: selectedPrescription?.medications,
            })
        } catch (error) {
            console.error(error);
        }
    }

    const handleDownload = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/prescriptions/label/${selectPharmacistPrescription?.id}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'image.png'); // adjust extension as needed
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the image:', error);
        }
    };
 
    const capitalize = (string:string):string => {
        if(!string) {
            return '';
        }
        return string[0].toUpperCase() + string.slice(1)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {/* Sidebar with prescription list for patients */}
            {(role == 'patient') && (
                <>
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold mb-2">Your Prescriptions</h2>
                    {patientPrescriptions.map((prescription, index) => {
                        return (
                            <Card key={index} onClick={() => handleSelectPatientPrescription(prescription)} className="mb-2 cursor-pointer">
                                <CardContent>
                                    <p className="font-medium">Prescription {index + 1}</p>
                                    <p className="text-sm">{capitalize(prescription.drugName)} - {capitalize(prescription.drugStrength)}</p>
                                </CardContent>
                            </Card>)
                    })}
                </div>
                </>
            )}

            {/* Selected Patient Card */}
            {(role == 'patient' && selectPatientPrescription) && (
                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">
                        Prescription Details
                    </h2>
                <Card>
                    <CardContent className='space-y-4'>
                        {/* Doctor Information */}
                        <div>
                            <p className="font-medium">
                                Doctor
                            </p>
                            <p >
                                Dr. {capitalize(selectPatientPrescription?.doctor.firstName || '')} {capitalize(selectPatientPrescription?.doctor.lastName || '')}
                            </p>
                            <p>
                                Specialization : {capitalize(selectPatientPrescription?.doctor.specialization || '')}
                            </p>
                            <p>
                                Email : {(selectPatientPrescription?.doctor.email || '')}
                            </p>
                        </div>
                        {/* Patient Information */}
                        <div>
                            <p className="font-medium">
                                Pharmacy
                            </p>
                            <p>
                                Pharmacist : {capitalize(selectPatientPrescription?.pharmacist.name || '')}
                            </p>
                            <p>
                                Address : {capitalize(selectPatientPrescription?.pharmacist.address || '')}
                            </p>
                            <p>
                                Email : {(selectPatientPrescription?.pharmacist.email || '')}
                            </p>
                        </div>
                        {/* Prescription Information */
                        }
                        <div>
                            <p>
                                Drug Name : {capitalize(selectPatientPrescription?.drugName || '')}
                            </p>
                            <p>
                                Drug Strength : {capitalize(selectPatientPrescription?.drugStrength || '')}
                            </p>
                            <p>
                                Dosage Form : {capitalize(selectPatientPrescription?.dosageForm || '')}
                            </p>
                            <p>
                                Quantitity : {selectPatientPrescription?.quantity}
                            </p>
                            <p>
                                Directions For Use : {selectPatientPrescription?.directionsForUse}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                </div>
            )}

            {/* Sidebar with prescription list for pharmacists */}
            {(role == 'pharmacist') && (
                <>
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-semibold mb-2">Assigned Prescriptions</h2>
                        {pharmacistPrescriptions.map((prescription, index) => {
                            return (
                                <Card key={index} onClick={() => handleSelectPharmacistPrescription(prescription)} className="mb-2 cursor-pointer">
                                    <CardContent>
                                        <p className="font-medium">Prescription {index + 1}</p>
                                        <p className='text-sm'>{capitalize(prescription.patient.firstName)} {capitalize(prescription.patient.lastName)}</p>
                                        <p className="text-sm">{capitalize(prescription.drugName)} - {capitalize(prescription.drugStrength)}</p>
                                    </CardContent>
                                </Card>)
                        })}
                    </div>
                </>
            )}

            {/* Selected Pharmacy Card */}
            {(role == 'pharmacist' && selectPharmacistPrescription) && (
                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">
                        Prescription Details
                    </h2>
                    <Card>
                        <CardContent className='space-y-4'>
                            {/* Doctor Information */}
                            <div>
                                <p className="font-medium">
                                    Doctor
                                </p>
                                <p >
                                    Dr. {capitalize(selectPharmacistPrescription?.doctor.firstName || '')} {capitalize(selectPatientPrescription?.doctor.lastName || '')}
                                </p>
                                <p>
                                    Specialization : {capitalize(selectPharmacistPrescription?.doctor.specialization || '')}
                                </p>
                                <p>
                                    Email : {(selectPharmacistPrescription?.doctor.email || '')}
                                </p>
                            </div>
                            {/* Patient Information */}
                            <div>
                                <p className="font-medium">
                                    Patient
                                </p>
                                <p>
                                    Name : {capitalize(selectPharmacistPrescription?.patient.firstName || '')} {capitalize(selectPharmacistPrescription?.patient.lastName || '')}
                                </p>
                                <p>
                                    Address : {capitalize(selectPharmacistPrescription?.patient.address || '')}
                                </p>
                                <p>
                                    Email : {(selectPharmacistPrescription?.patient.email || '')}
                                </p>
                            </div>
                            {/* Prescription Information */
                            }
                            <div>
                                <p>
                                    Drug Name : {capitalize(selectPatientPrescription?.drugName || '')}
                                </p>
                                <p>
                                    Drug Strength : {capitalize(selectPatientPrescription?.drugStrength || '')}
                                </p>
                                <p>
                                    Dosage Form : {capitalize(selectPatientPrescription?.dosageForm || '')}
                                </p>
                                <p>
                                    Quantitity : {selectPatientPrescription?.quantity}
                                </p>
                                <p>
                                    Directions For Use : {selectPatientPrescription?.directionsForUse}
                                </p>
                            </div>
                        </CardContent>
                        <Button className="w-full" onClick={() => handleDownload()}>Download Label</Button>
                    </Card>
                </div>
            )}

            {/* Sidebar with prescription list for Doctors */}
            {(role == 'doctor') && (
                <>
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-semibold mb-2">Assigned Prescriptions</h2>
                        {doctorPrescriptions.map((prescription, index) => {
                            return (
                                <Card key={index} onClick={() => handleSelectDoctorPrescription(prescription, false)} className="mb-2 cursor-pointer">
                                    <CardContent>
                                        <p className="font-medium">Prescription {index + 1}</p>
                                        <p className='text-sm'>{capitalize(prescription.patient.firstName)} {capitalize(prescription.patient.lastName)}</p>
                                        <p className="text-sm">{capitalize(prescription.drugName)} - {capitalize(prescription.drugStrength)}</p>
                                    </CardContent>
                                </Card>
                                )
                        })}
                        <Card onClick={() => handleSelectDoctorPrescription(null, true)} className="mb-2 cursor-pointer">
                            <CardContent>
                                <p className="font-medium">+ New Prescription</p>
                            </CardContent>
                        </Card>
                    </div>
                </>)}       

            {(role === 'dctor') && (
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold mb-2">Your Prescriptions</h2>
                    {Array.isArray(prescriptionList) && prescriptionList?.map((prescription, index) => {
                        return(
                            <Card key={index} onClick={() => handleSelectPatientPrescription(prescription)} className="mb-2 cursor-pointer">
                            <CardContent>
                                <p className="font-medium">Prescription {index + 1}</p>
                                <p className="text-sm">{capitalize(prescription.drugName)} - {capitalize(prescription.drugStrength)}</p>
                            </CardContent>
                        </Card>)})}
                </div>
            )}

            {(role == 'doctor' && selectDoctorPrescription) && (
                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">
                        Prescription Details
                    </h2>
                    <Card>
                        <CardContent className='space-y-4'>
                            {/* Patient Information */}
                            <div>
                                <p className="font-medium">
                                    Patient
                                </p>
                                <p>
                                    Name : {capitalize(selectDoctorPrescription?.patient.firstName || '')} {capitalize(selectPharmacistPrescription?.patient.lastName || '')}
                                </p>
                                <p>
                                    Address : {capitalize(selectDoctorPrescription?.patient.address || '')}
                                </p>
                                <p>
                                    Email : {(selectDoctorPrescription?.patient.email || '')}
                                </p>
                            </div>
                            {/* Prescription Information */}
                            <div>
                                <label className="block mb-1 font-medium">Drug Name</label>
                                <Input type='text'
                                    defaultValue={selectDoctorPrescription?.drugName || ''}
                                />
                                <label className="block mb-1 font-medium">Drug Strength</label>
                                <Input type='text'
                                    defaultValue={selectDoctorPrescription?.drugStrength || ''}
                                />
                                <label className="block mb-1 font-medium">Dosage Form</label>
                                <Input type='text'
                                    defaultValue={selectDoctorPrescription?.dosageForm || ''}
                                />
                                <label className="block mb-1 font-medium">Quantity</label>
                                <Input type='text'
                                    defaultValue={selectDoctorPrescription?.quantity || ''}
                                />
                                <label className="block mb-1 font-medium">Directions For Use</label>
                                <Input type='text'
                                    defaultValue={selectPatientPrescription?.directionsForUse || ''}
                                />
                            </div>
                        </CardContent>
                        <Button className="w-full">Save Prescription</Button>
                    </Card>
                </div>
            )}

            {(role == 'doctor') && newPrescription && (
                <>
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">
                            Create Prescription
                        </h2>
                    <div className="mb-4">
                        <Input
                            placeholder="Search patient"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handlePatientSearch(); // your function here
                                }
                            }}
                        />
                    </div>
                            <div>
                                <p className="font-medium">
                                    Patient
                                </p>
                                <p>
                                Name : {capitalize(newPatient?.firstName || '')} {capitalize(newPatient?.lastName || '')}
                                </p>
                                <p>
                                Address : {capitalize(newPatient?.address || '')}
                                </p>
                                <p>
                                Email : {(newPatient?.email || '')}
                                </p>
                            </div>
                        <Button variant="outline" className="w-full"
                            onClick={startRecording}
                            disabled={isRecording}>
                            Record Prescription
                        </Button>
                        <Button variant="outline" className="w-full"
                            onClick={stopRecording}
                            disabled={!isRecording}>
                            Transcribe
                        </Button>
                        {/* Prescription Details */}
                        <div>
                            <label className="block mb-1 font-medium">Drug Name</label>
                            <Input type='text'
                                defaultValue={selectedPrescription?.drugName || ''}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Drug Strength</label>
                            <Input type='text'
                                defaultValue={selectedPrescription?.drugStrength || ''}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Dosage Form</label>
                            <Input type='text'
                                defaultValue={selectedPrescription?.dosageForm || ''}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Quantity</label>
                            <Input type='text'
                                defaultValue={selectedPrescription?.quantity || ''}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Directions for Use</label>
                            <Input type='text'
                                defaultValue={selectedPrescription?.directionsForUse || ''}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Medications</label>
                            {selectedPrescription?.medications?.map((medication, index) => (
                                <div key={index} className="mb-4">
                                    <div>
                                        <label className="block mb-1 font-medium">Medication Name</label>
                                        <Input type='text'
                                            defaultValue={medication.name || ''}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium">Dosage</label>
                                        <Input type='text'
                                            defaultValue={medication.dosage || ''}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium">Frequency</label>
                                        <Input type='text'
                                            defaultValue={medication.frequency || ''}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium">Duration</label>
                                        <Input type='text'
                                            defaultValue={medication.duration || ''}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Pharmacy</label>
                            <select
                                value={selectedPharmacy || ""}
                                onChange={handlePharmacyChange}
                                className="w-48 h-10 p-2 text-sm border rounded"
                            >
                                <option value="" disabled>Select Pharmacy</option>
                                {Array.isArray(pharmacies) && pharmacies.map((pharmacy, index) => (
                                    <option
                                        key={pharmacy.email || index}
                                        value={pharmacy.email || ''}
                                    >
                                        {pharmacy.name || 'Unnamed Pharmacy'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {role === 'doctor' && <Button className="w-full" onClick={handleSavePrescription}>Save Prescription</Button>}
                    </div>

                </>
            )}
         </div>
    );
} 
