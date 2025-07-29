import React from "react";
import { Room } from "livekit-client";
interface FloatingVideoDisplayProps {
    room?: Room | null;
    videoTrack?: any;
}
export declare const FloatingVideoDisplay: React.FC<FloatingVideoDisplayProps>;
export declare const LocalVideoDisplay: React.FC;
export {};
