// proxy/WebSocketProxy.ts
import WebSocket, { WebSocketServer } from 'ws';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = './proto/audio.proto';

export class WebSocketProxy {
    private wss: WebSocketServer;
    private audioProto: any;

    constructor(private grpcHost: string = 'localhost:50051', private wsPort: number = 8080) {
        this.audioProto = this.loadGrpcProto();
        this.wss = new WebSocketServer({ port: this.wsPort });

        this.wss.on('connection', this.handleConnection.bind(this));
        console.log(`WebSocket server started on ws://localhost:${this.wsPort}`);
    }

    private loadGrpcProto() {
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });
        return grpc.loadPackageDefinition(packageDefinition).audio;
    }

    private handleConnection(ws: WebSocket) {
        console.log('Browser connected via WebSocket');

        const grpcClient = new this.audioProto.AudioStreamer(
            this.grpcHost,
            grpc.credentials.createInsecure()
        );

        const call = grpcClient.streamAudio();

        // gRPC → Browser
        call.on('data', (response: any) => {
            ws.send(JSON.stringify({ transcript: response.message }));
        });

        call.on('end', () => {
            ws.close();
            console.log('gRPC stream ended, WebSocket closed');
        });

        call.on('error', (err: any) => {
            console.error('gRPC error:', err);
            ws.send(JSON.stringify({ error: 'gRPC error', detail: err.message }));
        });

        // Browser → gRPC
        ws.on('message', (data: Buffer) => {
            call.write({ audioData: data });
        });

        ws.on('close', () => {
            call.end();
            console.log('WebSocket closed, gRPC stream ended');
        });
    }
}
