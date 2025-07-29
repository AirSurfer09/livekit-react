import { useCallback } from "react";
export const useDynamicInfoUpdater = (room) => {
    const updateDynamicInfo = useCallback((dynamicInfo) => {
        if (room && room.localParticipant && dynamicInfo.text?.trim()) {
            const message = {
                type: "update-dynamic-info",
                data: {
                    dynamic_info: {
                        text: dynamicInfo.text.trim(),
                    },
                },
            };
            const encodedData = new TextEncoder().encode(JSON.stringify(message));
            room.localParticipant.publishData(encodedData, {
                reliable: true,
                destinationSids: [], // Send to all participants
            });
            console.log("🔄 Dynamic info updated:", dynamicInfo.text);
        }
    }, [room]);
    return {
        updateDynamicInfo,
    };
};
