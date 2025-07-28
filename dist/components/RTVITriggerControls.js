import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRTVITriggerSender } from "../hooks/useRTVITriggerSender";
export const RTVITriggerControls = ({ className = "" }) => {
    const { sendTriggerByName, sendTriggerByMessage, isConnected } = useRTVITriggerSender();
    const [triggerName, setTriggerName] = useState("");
    const [triggerMessage, setTriggerMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleSendTriggerName = async () => {
        if (!triggerName.trim())
            return;
        setIsLoading(true);
        try {
            await sendTriggerByName(triggerName);
            setTriggerName("");
        }
        catch (error) {
            console.error('Failed to send trigger by name:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSendTriggerMessage = async () => {
        if (!triggerMessage.trim())
            return;
        setIsLoading(true);
        try {
            await sendTriggerByMessage(triggerMessage);
            setTriggerMessage("");
        }
        catch (error) {
            console.error('Failed to send trigger by message:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Quick trigger buttons for common actions
    const quickTriggers = [
        { name: "ENTER_SPACESHIP", label: "Enter Spaceship" },
        { name: "COMBAT_START", label: "Start Combat" },
        { name: "EXPLORE_PLANET", label: "Explore Planet" },
    ];
    const handleQuickTrigger = async (triggerName) => {
        setIsLoading(true);
        try {
            await sendTriggerByName(triggerName);
        }
        catch (error) {
            console.error('Failed to send quick trigger:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!isConnected) {
        return (_jsx("div", { className: `bg-gray-800 rounded-lg p-4 opacity-50 ${className}`, children: _jsx("p", { className: "text-gray-400 text-sm", children: "Connect to start sending triggers" }) }));
    }
    return (_jsxs("div", { className: `bg-gray-800 rounded-lg p-4 space-y-4 ${className}`, children: [_jsx("h3", { className: "text-white font-semibold", children: "RTVI Trigger Controls" }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-gray-300 text-sm", children: "Quick Triggers:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: quickTriggers.map((trigger) => (_jsx("button", { onClick: () => handleQuickTrigger(trigger.name), disabled: isLoading, className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors", children: trigger.label }, trigger.name))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-gray-300 text-sm", children: "Send Trigger by Name:" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: triggerName, onChange: (e) => setTriggerName(e.target.value), placeholder: "Enter trigger name...", className: "flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none", onKeyPress: (e) => e.key === 'Enter' && handleSendTriggerName() }), _jsx("button", { onClick: handleSendTriggerName, disabled: !triggerName.trim() || isLoading, className: "px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors", children: "Send" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-gray-300 text-sm", children: "Send Trigger by Message:" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: triggerMessage, onChange: (e) => setTriggerMessage(e.target.value), placeholder: "Enter trigger message...", className: "flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none", onKeyPress: (e) => e.key === 'Enter' && handleSendTriggerMessage() }), _jsx("button", { onClick: handleSendTriggerMessage, disabled: !triggerMessage.trim() || isLoading, className: "px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded transition-colors", children: "Send" })] })] })] }));
};
