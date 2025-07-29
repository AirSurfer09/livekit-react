import { useCallback } from "react";
export const useTemplateKeysUpdater = (room) => {
    const updateTemplateKeys = useCallback((templateKeys) => {
        if (room && room.localParticipant && Object.keys(templateKeys).length > 0) {
            const message = {
                type: "update-template-keys",
                data: {
                    template_keys: templateKeys,
                },
            };
            const encodedData = new TextEncoder().encode(JSON.stringify(message));
            room.localParticipant.publishData(encodedData, {
                reliable: true,
            });
            console.log("🔑 Template keys updated:", templateKeys);
        }
    }, [room]);
    return {
        updateTemplateKeys,
    };
};
