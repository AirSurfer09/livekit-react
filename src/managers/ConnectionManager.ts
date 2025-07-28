import { Room, RoomEvent } from "livekit-client";
import { ConnectionData, ConvaiConfig } from "../types";

export class ConnectionManager {
  private room: Room | null = null;
  private coreServiceUrl: string;

  constructor(coreServiceUrl: string = "http://35.237.31.101:8000") {
    this.room = new Room();
    this.coreServiceUrl = coreServiceUrl;
  }

  async connect(config: ConvaiConfig): Promise<ConnectionData> {
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

      const connectionData: ConnectionData = await response.json();
      console.log("Connection data received:", connectionData);

      // Connect using the room_url from the response
      await this.room.connect(connectionData.room_url, connectionData.token);

      // Enable both microphone AND camera
      await this.room.localParticipant.setMicrophoneEnabled(true);
      await this.room.localParticipant.setCameraEnabled(true);

      console.log("Connected to room:", connectionData.room_name);
      console.log("Session ID:", connectionData.session_id);

      return connectionData;
    } catch (error) {
      console.error("Connection failed:", error);
      throw error;
    }
  }

  disconnect(): void {
    if (this.room) {
      this.room.disconnect();
    }
  }

  getRoom(): Room | null {
    return this.room;
  }

  onDeviceFailure(callback: (error: Error) => void): void {
    if (this.room) {
      this.room.on(RoomEvent.MediaDevicesError, callback);
    }
  }

  offDeviceFailure(callback: (error: Error) => void): void {
    if (this.room) {
      this.room.off(RoomEvent.MediaDevicesError, callback);
    }
  }
}

