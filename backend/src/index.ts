// import express, {Request, Response} from "express";
// import dotenv from "dotenv";
// import cors from 'cors';
// import cookieParser from "cookie-parser";
// import mongoose from "mongoose";
// import authRouter from "./router/auth";
// import multer from "multer";
// import { OpenAI } from "openai";
// import fs from "fs";
// import {fileTypeFromBuffer} from 'file-type';
// import path from "path";
// import { exec } from 'child_process';
// import util from 'util';
// const execPromise = util.promisify(exec);
// import User from "./models/User";
// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3001;


// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use("/api/auth", authRouter);
// mongoose
//     .connect(process.env.MONGO_URI as string)
//     .then(() => console.log("MongoDB Connected"))
//     .catch((err) => console.log("MongoDB Connection Error:", err));

// app.post('/api/patient', async (req:Request, res:Response):Promise<any> => {
//     try {
//         const {email} = req.body;
//         if(!email) {
//             res.status(400).json({message : 'no email address provided'});
//         }
//         const existingPatient = await User.findOne({ email, role: 'Patient' });
//         if (!existingPatient) {
//                 return res.status(400).json({ message: "No patient found" });
//             }
//         return res.status(200).json({
//             first_name: existingPatient['first_name'],
//             last_name: existingPatient['last_name'],
//             address: existingPatient['address']
//         })
//     } catch (error) {
        
//     }
// });


// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


// const upload = multer({ dest: "uploads/",
//     fileFilter: (req, file, cb) => {
//         const filetypes = /wav|mp3|m4a|ogg|flac|mp4/; // Add other formats as needed
//         const mimetype = filetypes.test(file.mimetype);
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//         if (mimetype && extname) {
//             return cb(null, true);
//         }
//         cb(new Error('Error: File type not supported!'));
//     }
// });

// app.post("/api/decode", upload.single("audio"), async (req:Request, res:Response):Promise<any> => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: "No audio file uploaded" });
//         }

//         // Transcribe audio using OpenAI's Whisper API
//         const fileBuffer = fs.readFileSync(req.file.path);
//         const type = await fileTypeFromBuffer(fileBuffer);
//         console.log("Detected file type:", type);

//         let filePathToSend = req.file.path;

//         if (type && type.mime === "audio/wav") {
//             const outputFilePath = req.file.path + ".flac";
//             await execPromise(`ffmpeg -i ${req.file.path} -acodec flac -ar 16000 -ac 1 ${outputFilePath}`);
//             filePathToSend = outputFilePath; // Use the new FLAC file for transcription
//         }
//         const transcription = await openai.audio.transcriptions.create({
//             file: fs.createReadStream(filePathToSend),
//             model: "whisper-1",
//             response_format: "text",
//         });

//         console.log("Transcription:", transcription);

//         // Extract medicine name & dosage (Basic regex-based approach)
//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo", // or use "gpt-4" for a more advanced model
//             messages: [
//                 { role: "system", content: "You are a helpful assistant for extracting prescription details as JSON {prescription_name : , prescription_dosage : }" },
//                 { role: "user", content: transcription }
//             ]
//         });
//         const prescriptionDetails = response?.choices[0]?.message?.content?.trim();
//         console.log("Extracted Prescription Details:", prescriptionDetails);
//         // Cleanup uploaded file
//         fs.unlinkSync(req.file.path);
//         fs.unlinkSync(filePathToSend);
//         res.json({
//             prescriptionDetails
//         });

//     } catch (error) {
//         console.error("Error processing audio:", error);
//         res.status(500).json({ error: "Failed to process audio" });
//     }
// });
// app.listen(port, () => {
//         console.log(`Server running at http://localhost:${port}`);
// });

import App from "./app";
import dotenv from "dotenv";
dotenv.config();
const app = new App();
app.listen();