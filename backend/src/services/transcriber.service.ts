import { Request } from "express";
import { transcribeAudioFile } from "../utils/transcription"; // These are utility functions for the actual transcription logic
import { convertWebmToWav } from '../utils/audioconversion';
import fs from 'fs';
import path from 'path';
import tmp from 'tmp'; // To handle temporary file creation in memory

const uploadDir = path.join(__dirname, 'uploads');

class TranscriberService {
    public async transcribeAudio(audioFile: Express.Multer.File): Promise<string | undefined> {
        // Call an external API or library to transcribe the audio file
        try {
            const tmpFile = tmp.fileSync({ postfix: '.webm' });

            // Write the buffer directly to the temp file
            fs.writeFileSync(tmpFile.name, audioFile.buffer);

            // Define output file path for WAV conversion
            const outputFilePath = tmp.tmpNameSync({ postfix: '.wav' });

            // Convert WebM to WAV
            await convertWebmToWav(tmpFile.name, outputFilePath);

            // Read the WAV file into a buffer and pass to transcription
            const wavFileBuffer = fs.readFileSync(outputFilePath);
            const transcription = await transcribeAudioFile(wavFileBuffer);

            // Clean up temporary files
            tmpFile.removeCallback();
            fs.unlinkSync(outputFilePath);

            return transcription;
        } catch (error: any) {
            console.error(error)
            throw new Error("Error transcribing audio file: " + error.message);
        }
    }
}

export default TranscriberService;
