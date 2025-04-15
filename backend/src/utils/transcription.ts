import { SpeechClient } from '@google-cloud/speech';
import { protos } from '@google-cloud/speech';
import * as wav from 'node-wav';
const client = new SpeechClient();

// Utility function to transcribe an audio buffer
export async function transcribeAudioFile(audioBuffer: Buffer): Promise<string | undefined> {
    try {
        // Convert audio buffer to base64 encoding for the request
        const result = wav.decode(audioBuffer);
        const sampleRate = result.sampleRate;
        const audioBytes = audioBuffer.toString('base64');

        const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
            audio: {
                content: audioBytes, // base64 string of the audio file
            },
            config: {
                encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
                sampleRateHertz: sampleRate,
                languageCode: 'en-US',
            },
        };

        // Make the API call to Google Cloud Speech
        const [response] = await client.recognize(request);

        // Extract and return the transcription text
        const transcription = response.results
            ?.map(result => result.alternatives?.[0].transcript)
            .join('\n');

        return transcription;
    } catch (error) {
        console.error('Error transcribing audio file:', error);
        throw new Error('Transcription failed');
    }
}
