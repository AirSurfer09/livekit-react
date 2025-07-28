import React, { useState } from "react";
import { useRTVITriggerSender } from "../hooks/useRTVITriggerSender";

export interface RTVITriggerControlsProps {
  className?: string;
}

export const RTVITriggerControls: React.FC<RTVITriggerControlsProps> = ({ className = "" }) => {
  const { sendTriggerByName, sendTriggerByMessage, isConnected } = useRTVITriggerSender();
  const [triggerName, setTriggerName] = useState("");
  const [triggerMessage, setTriggerMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendTriggerName = async () => {
    if (!triggerName.trim()) return;
    
    setIsLoading(true);
    try {
      await sendTriggerByName(triggerName);
      setTriggerName("");
    } catch (error) {
      console.error('Failed to send trigger by name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTriggerMessage = async () => {
    if (!triggerMessage.trim()) return;
    
    setIsLoading(true);
    try {
      await sendTriggerByMessage(triggerMessage);
      setTriggerMessage("");
    } catch (error) {
      console.error('Failed to send trigger by message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick trigger buttons for common actions
  const quickTriggers = [
    { name: "ENTER_SPACESHIP", label: "Enter Spaceship" },
    { name: "COMBAT_START", label: "Start Combat" },
    { name: "EXPLORE_PLANET", label: "Explore Planet" },
  ];

  const handleQuickTrigger = async (triggerName: string) => {
    setIsLoading(true);
    try {
      await sendTriggerByName(triggerName);
    } catch (error) {
      console.error('Failed to send quick trigger:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 opacity-50 ${className}`}>
        <p className="text-gray-400 text-sm">Connect to start sending triggers</p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-4 space-y-4 ${className}`}>
      <h3 className="text-white font-semibold">RTVI Trigger Controls</h3>
      
      {/* Quick Triggers */}
      <div className="space-y-2">
        <p className="text-gray-300 text-sm">Quick Triggers:</p>
        <div className="flex flex-wrap gap-2">
          {quickTriggers.map((trigger) => (
            <button
              key={trigger.name}
              onClick={() => handleQuickTrigger(trigger.name)}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
            >
              {trigger.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Trigger Name */}
      <div className="space-y-2">
        <label className="text-gray-300 text-sm">Send Trigger by Name:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={triggerName}
            onChange={(e) => setTriggerName(e.target.value)}
            placeholder="Enter trigger name..."
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleSendTriggerName()}
          />
          <button
            onClick={handleSendTriggerName}
            disabled={!triggerName.trim() || isLoading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors"
          >
            Send
          </button>
        </div>
      </div>

      {/* Custom Trigger Message */}
      <div className="space-y-2">
        <label className="text-gray-300 text-sm">Send Trigger by Message:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={triggerMessage}
            onChange={(e) => setTriggerMessage(e.target.value)}
            placeholder="Enter trigger message..."
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleSendTriggerMessage()}
          />
          <button
            onClick={handleSendTriggerMessage}
            disabled={!triggerMessage.trim() || isLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}; 