import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { useVoiceAssistant } from '@livekit/components-react';
import { LiveKitManagerProvider, LiveKitAudioRenderer, LiveKitAgentVisualizer, LiveKitControlBar, useLiveKitManager } from '../managers/LiveKitManager';
import { TranscriptionView, LocalVideoDisplay, RTVITriggerControls, NoAgentNotification, } from './index';
import { useDataMessageListener } from '../hooks';
const VoiceAssistantContent = ({ onConnect, config }) => {
    const { state: agentState } = useVoiceAssistant();
    const { connect } = useLiveKitManager();
    const handleConnect = async () => {
        try {
            await connect(config);
            onConnect();
        }
        catch (error) {
            console.error('Connection failed:', error);
        }
    };
    return (_jsx(_Fragment, { children: _jsx(AnimatePresence, { mode: "wait", children: agentState === "disconnected" ? (_jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }, className: "grid items-center justify-center h-full", children: _jsx(motion.button, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay: 0.1 }, className: "uppercase px-4 py-2 bg-white text-black rounded-md", onClick: handleConnect, children: "Start a conversation" }) }, "disconnected")) : (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }, className: "flex flex-col items-center gap-4 h-full relative", children: [_jsx("div", { className: "absolute top-4 right-4 z-10", children: _jsx(LocalVideoDisplay, {}) }), _jsx(LiveKitAgentVisualizer, {}), _jsx("div", { className: "flex-1 w-full", children: _jsx(TranscriptionView, {}) }), _jsx("div", { className: "w-full max-w-[512px]", children: _jsx(RTVITriggerControls, {}) }), _jsx("div", { className: "w-full", children: _jsx(LiveKitControlBar, { onConnect: onConnect }) }), _jsx(LiveKitAudioRenderer, {}), _jsx(NoAgentNotification, { state: agentState })] }, "connected")) }) }));
};
export const LiveKitVoiceAssistant = ({ children, onConnect, config }) => {
    return (_jsx(LiveKitManagerProvider, { children: _jsx("main", { "data-lk-theme": "default", className: "h-full grid content-center bg-[var(--lk-bg)]", children: _jsxs("div", { className: "lk-room-container max-w-[1024px] w-[90vw] mx-auto max-h-[90vh]", children: [_jsx(VoiceAssistantContent, { onConnect: onConnect, config: config }), _jsx(DataMessageListener, {}), children] }) }) }));
};
// Component to initialize data message listener
const DataMessageListener = () => {
    useDataMessageListener();
    return null; // This component doesn't render anything
};
