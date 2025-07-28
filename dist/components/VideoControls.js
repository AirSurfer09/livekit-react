import { jsx as _jsx } from "react/jsx-runtime";
import { useLocalParticipant } from "@livekit/components-react";
import { useState, useEffect } from "react";
export function VideoControls() {
    const { localParticipant } = useLocalParticipant();
    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    useEffect(() => {
        if (localParticipant) {
            setIsCameraEnabled(localParticipant.isCameraEnabled);
        }
    }, [localParticipant]);
    const toggleCamera = async () => {
        if (localParticipant) {
            try {
                await localParticipant.setCameraEnabled(!isCameraEnabled);
                setIsCameraEnabled(!isCameraEnabled);
            }
            catch (error) {
                console.error('Failed to toggle camera:', error);
            }
        }
    };
    return (_jsx("button", { onClick: toggleCamera, className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isCameraEnabled
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-600 hover:bg-gray-700 text-white'}`, children: isCameraEnabled ? (_jsx("span", { className: "flex items-center gap-1", children: "\uD83D\uDCF9 Camera On" })) : (_jsx("span", { className: "flex items-center gap-1", children: "\uD83D\uDCF9 Camera Off" })) }));
}
