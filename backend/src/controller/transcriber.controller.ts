import { Request, Response } from "express";
import TranscriberService from "../services/transcriber.service";

class TranscriberController {
    private readonly transcriberService: TranscriberService;

    constructor() {
        this.transcriberService = new TranscriberService();
    }

    public async transcribe(req: Request, res: Response): Promise<void> {
        try {
            const audioFile = req.file; // Assuming file is uploaded via multer
            if (!audioFile) {
                res.status(400).json({ error: "No audio file provided" });
                return;
            }
            const transcription = await this.transcriberService.transcribeAudio(audioFile);
            res.status(200).json({ transcription });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default TranscriberController;
