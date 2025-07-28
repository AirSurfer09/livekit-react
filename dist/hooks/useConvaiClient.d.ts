import { ConvaiClient, ChatMessage } from '../types';
export declare const useConvaiClient: () => ConvaiClient & {
    activity: string;
    chatMessages: ChatMessage[];
};
