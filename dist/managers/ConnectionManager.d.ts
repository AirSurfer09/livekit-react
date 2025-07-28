import { Room } from "livekit-client";
import { ConnectionData, ConvaiConfig } from "../types";
export declare class ConnectionManager {
    private room;
    private coreServiceUrl;
    constructor(coreServiceUrl?: string);
    connect(config: ConvaiConfig): Promise<ConnectionData>;
    disconnect(): void;
    getRoom(): Room | null;
    onDeviceFailure(callback: (error: Error) => void): void;
    offDeviceFailure(callback: (error: Error) => void): void;
}
