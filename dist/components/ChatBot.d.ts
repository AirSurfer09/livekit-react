import React from 'react';
import { ConvaiClient } from '../types';
interface ChatBotProps {
    convaiClient: ConvaiClient & {
        activity?: string;
    };
    onConnect: () => void;
}
export declare const ChatBot: React.FC<ChatBotProps>;
export {};
