import { Router } from "express";
import TranscriberController from "../controller/transcriber.controller";
import uploadAudio from "../utils/uploadAudio";
import multer from "multer";

class TranscriberRoute {
    private readonly transcriberController: TranscriberController;
    public readonly router: Router;

    constructor() {
        this.transcriberController = new TranscriberController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        // Transcribe audio via POST request
        this.router.post("/", uploadAudio.single('audio'),this.transcriberController.transcribe.bind(this.transcriberController));

        // Stream real-time transcription via POST request
    }
}

export default new TranscriberRoute().router;
