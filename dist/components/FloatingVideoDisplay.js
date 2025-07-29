import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { VideoTrack, RoomContext } from "@livekit/components-react";
import { useLocalCameraTrack } from "../hooks/useLocalCameraTrack";
/**
 * FloatingVideoDisplay component for displaying local camera feed in a floating window.
 *
 * Provides a collapsible video display with optional horizontal mirroring.
 * Ideal for selfie-style applications where users expect mirror-like behavior.
 *
 * @param {FloatingVideoDisplayProps} props - Component props
 * @param {Room | null} props.room - LiveKit room instance
 * @param {any} props.videoTrack - Video track reference (optional)
 * @param {boolean} props.mirror - Enable horizontal video mirroring (default: true)
 *
 * @example
 * ```tsx
 * function App() {
 *   const convaiClient = useConvaiClient();
 *
 *   return (
 *     <FloatingVideoDisplay
 *       room={convaiClient.room}
 *       videoTrack={convaiClient.videoTrack}
 *       mirror={true}
 *     />
 *   );
 * }
 * ```
 */
export const FloatingVideoDisplay = ({ room, mirror = true, }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    if (!room) {
        return (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "glass-light rounded-t-2xl px-4 py-3 mb-2 border-b border-emerald-500/20", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-3 h-3 bg-slate-400 rounded-full" }), _jsx("span", { className: "text-slate-300 text-sm font-medium", children: "Video" })] }), _jsx("button", { onClick: () => setIsExpanded(!isExpanded), className: "p-2 hover:bg-emerald-500/20 rounded-xl transition-all duration-200 text-slate-300 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 btn-hover-lift", children: _jsx("svg", { className: `w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })] }) }), _jsx("div", { className: `glass rounded-b-2xl overflow-hidden transition-all duration-300 ${isExpanded ? "w-80 h-48" : "w-80 h-16"}`, children: isExpanded && (_jsx("div", { className: "flex items-center justify-center h-full bg-slate-900/50", children: _jsxs("div", { className: "flex items-center space-x-3 text-slate-400", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-slate-500/10 flex items-center justify-center", children: _jsxs("svg", { width: "24", height: "12", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "text-slate-400", children: [_jsx("path", { d: "M37.47 20c-1.348 0-2.565-.277-3.651-.832a6.33 6.33 0 0 1-2.585-2.413c-.618-1.055-.927-2.321-.927-3.8v-.39c0-1.479.31-2.745.927-3.8a6.33 6.33 0 0 1 2.585-2.413c1.086-.554 2.303-.832 3.651-.832 1.33 0 2.463.231 3.399.694.955.462 1.723 1.1 2.303 1.914.58.795.955 1.692 1.124 2.69l-3.118.638a3.937 3.937 0 0 0-.534-1.553 2.97 2.97 0 0 0-1.208-1.137c-.505-.278-1.133-.416-1.882-.416-.767 0-1.46.166-2.078.499-.6.314-1.077.795-1.433 1.442-.337.647-.505 1.424-.505 2.33v.278c0 .906.168 1.683.505 2.33.356.629.834 1.11 1.433 1.442.618.333 1.31.5 2.078.5 1.143 0 2.004-.287 2.585-.86.599-.592.973-1.35 1.123-2.275l3.118.721a7.207 7.207 0 0 1-1.208 2.635c-.58.796-1.348 1.434-2.303 1.915-.936.462-2.07.693-3.399.693ZM52.761 20c-1.386 0-2.63-.277-3.736-.832a6.586 6.586 0 0 1-2.584-2.413c-.618-1.055-.927-2.312-.927-3.773v-.444c0-1.46.309-2.718.927-3.772a6.33 6.33 0 0 1 2.584-2.414c1.105-.554 2.35-.832 3.736-.832 1.386 0 2.622.278 3.708.832a6.146 6.146 0 0 1 2.556 2.414c.637 1.054.955 2.311.955 3.772v.444c0 1.46-.318 2.718-.955 3.773a6.387 6.387 0 0 1-2.556 2.413c-1.086.555-2.322.832-3.708.832Zm0-2.83c1.18 0 2.144-.37 2.893-1.109.75-.758 1.124-1.812 1.124-3.162v-.278c0-1.35-.375-2.395-1.124-3.134-.749-.758-1.713-1.137-2.893-1.137-1.18 0-2.144.379-2.893 1.137-.75.74-1.124 1.784-1.124 3.134v.278c0 1.35.375 2.404 1.124 3.162.749.74 1.713 1.11 2.893 1.11ZM62.08 19.612V5.908h3.175v1.914h.477c.244-.517.684-1.007 1.32-1.47.637-.462 1.601-.693 2.894-.693 1.067 0 2.013.24 2.837.721a4.936 4.936 0 0 1 1.91 1.997c.468.85.702 1.859.702 3.024v8.21h-3.23v-7.96c0-1.11-.281-1.933-.843-2.47-.543-.554-1.32-.831-2.331-.831-1.143 0-2.042.379-2.697 1.137-.655.74-.983 1.803-.983 3.19v6.935h-3.23ZM81.09 19.612 76.54 5.908h3.426l3.427 11.374h.478l3.455-11.374h3.426l-4.55 13.704H81.09ZM97.702 20c-1.143 0-2.2-.268-3.174-.804-.956-.555-1.723-1.36-2.304-2.414-.58-1.054-.87-2.32-.87-3.8v-.444c0-1.48.29-2.746.87-3.8.58-1.054 1.358-1.85 2.332-2.386a6.25 6.25 0 0 1 3.146-.832c1.31 0 2.312.222 3.005.666.693.444 1.208.952 1.545 1.526h.478V5.908h3.146v10.236c0 .555.262.832.786.832h1.152v2.636h-2.613c-.674 0-1.226-.185-1.657-.555-.412-.37-.618-.878-.618-1.526v-.083h-.477c-.319.684-.843 1.285-1.573 1.803-.731.5-1.789.749-3.174.749Zm.955-2.774c1.18 0 2.144-.37 2.893-1.11.768-.758 1.152-1.83 1.152-3.217v-.278c0-1.405-.384-2.478-1.152-3.217-.768-.74-1.732-1.11-2.893-1.11-1.161 0-2.135.37-2.922 1.11-.767.74-1.151 1.812-1.151 3.217v.278c0 1.387.384 2.46 1.151 3.217.787.74 1.76 1.11 2.922 1.11ZM109.264 19.612V5.908h3.23v13.704h-3.23Zm1.601-15.451c-.58 0-1.086-.185-1.517-.555-.412-.388-.618-.897-.618-1.526 0-.628.206-1.128.618-1.497A2.194 2.194 0 0 1 110.865 0c.618 0 1.124.194 1.517.583.412.37.618.869.618 1.497 0 .63-.206 1.138-.618 1.526-.393.37-.899.555-1.517.555Z", fill: "currentColor" }), _jsx("rect", { x: "7.443", y: "10.226", width: "9.41", height: "9.293", rx: "1.268", fill: "#34FF7A" }), _jsx("rect", { x: "16.572", y: "3.292", width: "6.601", height: "6.519", rx: "1.268", fill: "#34FF7A" }), _jsx("path", { d: "m16.572 8.353 1.685 1.456s-.54.022-.851.483c-.311.46-.553 1.32-.553 1.32l-1.756-1.387s.925-.18 1.236-.64c.311-.461.239-1.232.239-1.232Z", fill: "#34FF7A" }), _jsxs("g", { opacity: ".3", fill: "#34FF7A", children: [_jsx("rect", { x: "11.293", y: "7.466", width: "6.756", height: "6.672", rx: "1.268", transform: "rotate(-180 11.293 7.466)" }), _jsx("rect", { x: "4.739", y: "12.396", width: "4.739", height: "4.68", rx: "1.268", transform: "rotate(180 4.74 12.396)" }), _jsx("path", { d: "M4.74 8.758 3.53 7.712s.387-.015.61-.346c.224-.33.398-.948.398-.948l1.26.996s-.663.13-.887.46c-.224.33-.171.884-.171.884Z" })] })] }) }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm font-medium", children: "Not Connected" }), _jsx("p", { className: "text-xs opacity-75", children: "Connect to see video" })] })] }) })) })] }));
    }
    return (_jsx(RoomContext.Provider, { value: room, children: _jsx("div", { className: "relative", children: _jsx("div", { className: `glass rounded-b-2xl overflow-hidden transition-all duration-300 ${isExpanded ? "w-80 h-48" : "w-80 h-16"}`, children: isExpanded && (_jsx("div", { className: "p-4", children: _jsx(LocalVideoDisplay, { mirror: mirror }) })) }) }) }));
};
/**
 * LocalVideoDisplay component for rendering local camera feed.
 *
 * Displays the local participant's camera with optional horizontal mirroring.
 * Shows appropriate placeholder when camera is disabled or unavailable.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.mirror - Enable horizontal video mirroring (default: false)
 *
 * @example
 * ```tsx
 * function VideoComponent() {
 *   return <LocalVideoDisplay mirror={true} />;
 * }
 * ```
 */
export const LocalVideoDisplay = ({ mirror = false }) => {
    const cameraTrackRef = useLocalCameraTrack();
    if (!cameraTrackRef.publication?.isSubscribed) {
        return (_jsx("div", { className: "w-full h-40 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl flex items-center justify-center border border-slate-600/30 backdrop-blur-sm", children: _jsxs("div", { className: "text-center text-slate-400", style: {
                    width: "200px",
                }, children: [_jsx("div", { className: "w-12 h-12 mx-auto mb-3 bg-slate-500/10 rounded-full", style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "120px",
                            width: "80px",
                        }, children: _jsx("svg", { className: "w-6 h-6 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" }) }) }), _jsx("p", { className: "text-sm font-medium", children: "Camera Off" }), _jsx("p", { className: "text-xs opacity-75", children: "Enable camera to see yourself" })] }) }));
    }
    return (_jsxs("div", { className: "w-full h-40 rounded-xl overflow-hidden border border-emerald-500/30 relative bg-slate-900/30 backdrop-blur-sm", children: [_jsx("div", { style: {
                    transform: mirror ? 'scaleX(-1)' : 'none',
                    width: '100%',
                    height: '100%',
                }, children: _jsx(VideoTrack, { trackRef: cameraTrackRef }) }), _jsx("div", { className: "absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg border border-white/20", children: "You" })] }));
};
//# sourceMappingURL=FloatingVideoDisplay.js.map