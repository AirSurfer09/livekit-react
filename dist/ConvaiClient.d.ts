import React from 'react';
import { Room } from 'livekit-client';
export interface ConvaiClientProps {
    room?: Room;
    children?: React.ReactNode;
}
export declare const ConvaiClient: React.FC<ConvaiClientProps>;
