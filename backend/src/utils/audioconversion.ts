import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export function convertWebmToWav(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-i', inputPath,
            '-acodec', 'pcm_s16le',  // Linear16 codec (WAV)
            '-ar', '44100',          // 44.1kHz sample rate (common for transcription)
            '-ac', '1',              // Mono channel
            outputPath
        ]);

        ffmpeg.on('close', code => {
            if (code === 0) resolve();
            else reject(new Error(`FFmpeg exited with code ${code}`));
        });
    });
}
