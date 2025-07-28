import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { VideoTrack, RoomContext, useVoiceAssistant, BarVisualizer } from '@livekit/components-react';
import { useLocalCameraTrack } from '../hooks/useLocalCameraTrack';
export const FloatingVideoDisplay = ({ room, videoTrack }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    if (!room) {
        return (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "glass-light rounded-t-2xl px-4 py-3 mb-2 border-b border-emerald-500/20", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-3 h-3 bg-slate-400 rounded-full" }), _jsx("span", { className: "text-slate-300 text-sm font-medium", children: "Video" })] }) }) }), _jsx("div", { className: "glass rounded-b-2xl overflow-hidden w-80 h-16", children: _jsx("div", { className: "flex items-center justify-center h-full bg-slate-900/50", children: _jsxs("div", { className: "flex items-center space-x-3 text-slate-400", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" }) }) }), _jsx("span", { className: "text-sm font-medium", children: "Not Connected" })] }) }) })] }));
    }
    return (_jsx(RoomContext.Provider, { value: room, children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "glass-light rounded-t-2xl px-4 py-3 mb-2 border-b border-emerald-500/20", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-3 h-3 bg-emerald-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-emerald-300 text-sm font-medium", children: "Video" })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("button", { onClick: () => setIsExpanded(!isExpanded), className: "p-1.5 hover:bg-emerald-500/20 rounded-lg transition-all duration-200 text-slate-300 hover:text-emerald-300", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) }) })] }) }), _jsx("div", { className: `glass rounded-b-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'w-[512px] h-[512px]' : 'w-80 h-16'}`, children: !isExpanded ? (_jsx("div", { className: "flex items-center justify-center h-full bg-slate-900/50", children: _jsxs("div", { className: "flex items-center space-x-3 text-slate-400", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-emerald-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" }) }) }), _jsx("span", { className: "text-sm font-medium", children: "Video" })] }) })) : (_jsxs("div", { className: "relative w-full h-full", children: [_jsx("div", { className: "absolute top-4 right-4 z-10", children: _jsx(LocalVideoDisplay, {}) }), _jsx("div", { className: "w-full h-full flex items-center justify-center", children: _jsx(AgentVisualizer, {}) })] })) })] }) }));
};
// Local Video Display component - now includes agent visualizer when connected
const LocalVideoDisplay = () => {
    const cameraTrackRef = useLocalCameraTrack();
    const { videoTrack } = useVoiceAssistant();
    if (!cameraTrackRef.publication?.isSubscribed) {
        return (_jsx("div", { className: "w-48 h-36 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600", children: _jsx("span", { className: "text-gray-400 text-sm", children: "Camera Off" }) }));
    }
    return (_jsxs("div", { className: "w-48 h-36 rounded-lg overflow-hidden border-2 border-gray-600 relative", children: [_jsx(VideoTrack, { trackRef: cameraTrackRef }), _jsx("div", { className: "absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded", children: "You" }), videoTrack && (_jsx("div", { className: "absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center", children: _jsx("div", { className: "w-full h-full", children: _jsx(VideoTrack, { trackRef: videoTrack }) }) }))] }));
};
// Agent Visualizer component - matching livekit-react-test exactly
const AgentVisualizer = () => {
    const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();
    if (videoTrack) {
        return (_jsx("div", { className: "h-[512px] w-[512px] rounded-lg overflow-hidden", children: _jsx(VideoTrack, { trackRef: videoTrack }) }));
    }
    return (_jsx("div", { className: "h-[300px] w-full", children: _jsx(BarVisualizer, { state: agentState, barCount: 5, trackRef: audioTrack, className: "agent-visualizer", options: { minHeight: 24 } }) }));
};
