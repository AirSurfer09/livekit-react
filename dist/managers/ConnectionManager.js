import { Room, RoomEvent } from "livekit-client";
export class ConnectionManager {
    constructor(coreServiceUrl = "http://35.237.31.101:8000") {
        this.room = null;
        this.room = new Room();
        this.coreServiceUrl = coreServiceUrl;
    }
    async connect(config) {
        if (!this.room) {
            throw new Error("Room not initialized");
        }
        try {
            // Call Core Service API
            const response = await fetch(`${this.coreServiceUrl}/connect`, {
                method: "POST",
                headers: {
                    "x-api-key": config.token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    character_id: config.character_id,
                    transport: config.transport || "livekit",
                    connection_type: config.connection_type || "audio",
                    llm_provider: config.llm_provider || "gemini",
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const connectionData = await response.json();
            console.log("Connection data received:", connectionData);
            // Connect using the room_url from the response
            await this.room.connect(connectionData.room_url, connectionData.token);
            // Enable both microphone AND camera
            await this.room.localParticipant.setMicrophoneEnabled(true);
            await this.room.localParticipant.setCameraEnabled(true);
            console.log("Connected to room:", connectionData.room_name);
            console.log("Session ID:", connectionData.session_id);
            return connectionData;
        }
        catch (error) {
            console.error("Connection failed:", error);
            throw error;
        }
    }
    disconnect() {
        if (this.room) {
            this.room.disconnect();
        }
    }
    getRoom() {
        return this.room;
    }
    onDeviceFailure(callback) {
        if (this.room) {
            this.room.on(RoomEvent.MediaDevicesError, callback);
        }
    }
    offDeviceFailure(callback) {
        if (this.room) {
            this.room.off(RoomEvent.MediaDevicesError, callback);
        }
    }
}
