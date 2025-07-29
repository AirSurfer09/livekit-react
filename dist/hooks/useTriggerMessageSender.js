import { useCallback } from "react";
export const useTriggerMessageSender = (room) => {
    const sendTriggerMessage = useCallback((triggerName, triggerMessage) => {
        if (room && room.localParticipant) {
            const message = {
                type: "trigger-message",
                data: {
                    ...(triggerName && { trigger_name: triggerName }),
                    ...(triggerMessage && { trigger_message: triggerMessage }),
                },
            };
            const encodedData = new TextEncoder().encode(JSON.stringify(message));
            room.localParticipant.publishData(encodedData, {
                reliable: true,
            });
            console.log("🎯 Trigger message sent:", { triggerName, triggerMessage });
        }
    }, [room]);
    return {
        sendTriggerMessage,
    };
};
