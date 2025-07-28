import { TriggerPayload } from "../types";
/**
 * React hook for sending RTVI trigger messages through LiveKit data channel
 */
export declare function useRTVITriggerSender(): {
    sendTriggerMessage: (payload: TriggerPayload) => Promise<void>;
    sendTriggerByName: (triggerName: string) => Promise<void>;
    sendTriggerByMessage: (triggerMessage: string) => Promise<void>;
    isConnected: boolean;
};
