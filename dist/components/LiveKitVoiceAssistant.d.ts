import React from 'react';
import { LiveKitConfig } from '../managers/LiveKitManager';
interface LiveKitVoiceAssistantProps {
    children?: React.ReactNode;
    onConnect: () => void;
    config: LiveKitConfig;
}
export declare const LiveKitVoiceAssistant: React.FC<LiveKitVoiceAssistantProps>;
export {};
