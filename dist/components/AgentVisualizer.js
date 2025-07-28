import { jsx as _jsx } from "react/jsx-runtime";
import { BarVisualizer, VideoTrack, useVoiceAssistant, } from "@livekit/components-react";
export function AgentVisualizer() {
    const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();
    if (videoTrack) {
        return (_jsx("div", { className: "h-[512px] w-[512px] rounded-lg overflow-hidden", children: _jsx(VideoTrack, { trackRef: videoTrack }) }));
    }
    return (_jsx("div", { className: "h-[300px] w-full", children: _jsx(BarVisualizer, { state: agentState, barCount: 5, trackRef: audioTrack, className: "agent-visualizer", options: { minHeight: 24 } }) }));
}
