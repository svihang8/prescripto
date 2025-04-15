"use client";

import {getWaveBlob} from "webm-to-wav-converter";
import { useState, useRef } from "react";
import { FaMicrophone, FaStop, FaRedo, FaCheckCircle, FaSearch } from "react-icons/fa"; // Icons for voice control & search

export default function CreatePrescription() {
    const [email, setEmail] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [medicineName, setMedicineName] = useState("Aspirin");
    const [dosage, setDosage] = useState("500mg");
    const [pharmacy, setPharmacy] = useState("");
    const [patientInfo, setPatientInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const pharmacies = ["Pharmacy A", "Pharmacy B", "Pharmacy C"];

    // API request to fetch patient info
    const handleSearchPatient = async () => {
        if (!email.trim()) {
            alert("Please enter a valid Email.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:3001/api/patient", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) throw new Error("Patient not found");

            const data = await response.json();
            setPatientInfo(data);
        } catch (error) {
            alert(error.message);
            setPatientInfo(null);
        } finally {
            setLoading(false);
        }
    };

    // Start recording
    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                setAudioBlob(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Microphone access denied!");
        }
    };

    // Stop recording
    const handleStopRecording = async () => {
        if (!mediaRecorderRef.current) return;

        setIsRecording(false);

        mediaRecorderRef.current.onstop = async () => {
            try {
                // Ensure audio chunks exist
                if (audioChunksRef.current.length === 0) {
                    console.error("No recorded audio available.");
                    alert("Recording failed. Please try again.");
                    return;
                }

                // Convert recorded WebM audio to WAV
                const webmBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const wavBlob = await getWaveBlob(webmBlob, false); // Convert to 16-bit PCM WAV

                setAudioBlob(wavBlob);
            } catch (error) {
                console.error("Error converting WebM to WAV:", error);
                alert("Failed to convert audio.");
            }
        };

        mediaRecorderRef.current.stop();
    };


    // Reset recording
    const handleResetRecording = () => {
        setAudioBlob(null);
        setIsRecording(false);
    };

    // Submit recorded audio to API
    const handleSubmitAudio = async () => {
        if (!audioBlob) {
            alert("No audio recorded.");
            return;
        }
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav",);

        try {
            const response = await fetch("http://localhost:3001/api/decode", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to process audio.");

            const data = await response.json();
            alert(`Decoded Text: ${data.transcription}`);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleFinishPrescription = () => {
        alert("Prescription Creation Finished!");
    };

    const handleResetForm = () => {
        setEmail("");
        setIsRecording(false);
        setPharmacy("");
        setPatientInfo(null);
        setAudioBlob(null);
        alert("Form Reset");
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg my-12">
            <h2 className="text-2xl font-bold text-center mb-4">Create Prescription</h2>

            {/* Email Input and Search */}
            <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Patient Email
                </label>
                <div className="flex space-x-2">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 p-2 flex-grow border border-gray-300 rounded-md"
                        placeholder="Enter Patient Email"
                    />
                    <button
                        onClick={handleSearchPatient}
                        disabled={loading}
                        className="mt-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                        {loading ? "Searching..." : <FaSearch className="w-5 h-5" />}
                    </button>
                </div>

                {/* Patient Information Display */}
                {patientInfo && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-md">
                        <h3 className="font-medium text-gray-900">Patient Information</h3>
                        <p><strong>Name:</strong> {patientInfo['first_name'] + " " + patientInfo['last_name']}</p>
                        <p><strong>Address:</strong> {patientInfo['address']}</p>
                    </div>
                )}
            </div>

            {/* Voice Recording Controls */}
            <div className="mb-6 flex space-x-4 items-center">
                <button onClick={handleStartRecording} disabled={isRecording} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <FaMicrophone className="w-5 h-5" />
                </button>
                <button onClick={handleStopRecording} disabled={!isRecording} className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <FaStop className="w-5 h-5" />
                </button>
                <button onClick={handleResetRecording} disabled={!audioBlob} className="p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
                    <FaRedo className="w-5 h-5" />
                </button>
            </div>

            {/* Audio Playback */}
            {audioBlob && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700">Recorded Audio</h3>
                    <audio controls src={URL.createObjectURL(audioBlob)} className="mt-2 w-full" />
                </div>
            )}

            {/* Submit Audio Button */}
            <div className="mb-6">
                <button
                    onClick={handleSubmitAudio}
                    disabled={!audioBlob}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-full"
                >
                    Submit Audio for Decoding
                </button>
            </div>

            {/* Prescription Information */}
            <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Prescription Information</h3>
                <p><strong>Medicine Name:</strong> {medicineName}</p>
                <p><strong>Dosage:</strong> {dosage}</p>
            </div>

            {/* Pharmacy Selection */}
            <div className="mb-6">
                <label htmlFor="pharmacy" className="block text-sm font-medium text-gray-700">
                    Select Pharmacy
                </label>
                <select
                    id="pharmacy"
                    value={pharmacy}
                    onChange={(e) => setPharmacy(e.target.value)}
                    className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                >
                    <option value="">Select a Pharmacy</option>
                    {pharmacies.map((pharmacyName, index) => (
                        <option key={index} value={pharmacyName}>{pharmacyName}</option>
                    ))}
                </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
                <button onClick={handleResetForm} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Reset</button>
                <button onClick={handleFinishPrescription} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <FaCheckCircle className="inline-block mr-2 w-5 h-5" />
                    Finish Creation
                </button>
            </div>
        </div>
    );
}
