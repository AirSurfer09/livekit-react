import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
export function VideoControls({ room }) {
    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    useEffect(() => {
        if (room && room.localParticipant) {
            setIsCameraEnabled(room.localParticipant.isCameraEnabled);
        }
    }, [room]);
    const toggleCamera = async () => {
        if (room && room.localParticipant) {
            try {
                await room.localParticipant.setCameraEnabled(!isCameraEnabled);
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
