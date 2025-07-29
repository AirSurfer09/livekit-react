import { Room } from "livekit-client";
export interface TemplateKeys {
    [key: string]: string;
}
export declare const useTemplateKeysUpdater: (room: Room | null, participantSid?: string) => {
    updateTemplateKeys: (templateKeys: TemplateKeys) => void;
};
