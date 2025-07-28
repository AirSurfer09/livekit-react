import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { VideoTrack } from "@livekit/components-react";
import { useLocalCameraTrack } from "../hooks/useLocalCameraTrack";
export function LocalVideoDisplay() {
    const cameraTrackRef = useLocalCameraTrack();
    if (!cameraTrackRef.publication?.isSubscribed) {
        return (_jsx("div", { className: "w-48 h-36 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600", children: _jsx("span", { className: "text-gray-400 text-sm", children: "Camera Off" }) }));
    }
    return (_jsxs("div", { className: "w-48 h-36 rounded-lg overflow-hidden border-2 border-gray-600 relative", children: [_jsx(VideoTrack, { trackRef: cameraTrackRef }), _jsx("div", { className: "absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded", children: "You" })] }));
}
