import React, { useState, useRef, useEffect } from "react";
import { ConvaiClient, ChatMessage } from "../types";
import {
  RoomContext,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { MicrophoneIcon } from "./MicrophoneIcon";

interface ChatBotProps {
  convaiClient: ConvaiClient & { activity?: string };
  onConnect: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({
  convaiClient,
  onConnect,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, activity, chatMessages, sendUserTextMessage, audioControls } = convaiClient;

  // Filter messages to only show the specified types in chat UI
  const filteredChatMessages = chatMessages.filter(
    (message) =>
      message.type === "user-llm-text" ||
      message.type === "bot-llm-text" ||
      message.type === "bot-emotion",
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [filteredChatMessages]);

  // Simulate typing indicator for Convai messages
  useEffect(() => {
    if (filteredChatMessages.length > 0) {
      const lastMessage = filteredChatMessages[filteredChatMessages.length - 1];
      if (lastMessage.type === "bot-llm-text") {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [filteredChatMessages]);

  const getStatusColor = () => {
    if (state.isConnected) return "bg-emerald-400 shadow-emerald-400/50";
    if (state.isConnecting) return "bg-yellow-400 shadow-yellow-400/50";
    return "bg-slate-400 shadow-slate-400/50";
  };

  const getStatusText = () => {
    if (state.isConnected) return "Connected";
    if (state.isConnecting) return "Connecting...";
    return "Disconnected";
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending || !state.isConnected) return;

    setIsSending(true);
    try {
      console.log("MESSAGE", inputText);
      sendUserTextMessage(inputText);
      setInputText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isLastMessage = index === filteredChatMessages.length - 1;

    switch (message.type) {
      case "user-llm-text":
        return (
          <div
            key={message.id}
            style={{
              padding: "8px 0",
            }}
          >
            <div
              className="items-end"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                maxWidth: "100%",
              }}
            >
              <div className="transparent border border-emerald-500/30 rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm" style={{padding: "12px 16px"}}>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
              <div
                className="flex items-center mt-2 space-x-2"
                style={{
                  marginRight: "12px",
                  marginTop: "4px",
                }}
              >
                <span className="text-emerald-400/60 text-xs font-medium">
                  You {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        );

      case "bot-llm-text":
        return (
          <div
            key={message.id}
            style={{
              padding: "8px 0",
            }}
          >
            <div
              className="items-start"
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "85%",
              }}
            >
              <div className="bg-emerald-500/20  border border-emerald-500/30 rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm" style={{padding: "12px 16px"}}>
                <p className="text-slate-100 text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
              <div
                className="flex items-center mt-2 space-x-2"
                style={{
                  marginLeft: "12px",
                  marginTop: "4px",
                }}
              >
                <span className="text-slate-400/60 text-xs font-medium">
                  Convai {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        );

      case "bot-emotion":
        return (
          <div
            key={message.id}
            className="flex justify-center mb-4 animate-in fade-in duration-500"
          >
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm">
              <p className="text-purple-200 text-sm font-medium">
                😊 {message.content}
              </p>
            </div>
          </div>
        );

      // Legacy message types - these won't be shown in filtered view but handle them gracefully
      case "user":
      case "convai":
      case "emotion":
      case "behavior-tree":
      case "action":
        return null;

      default:
        return null;
    }
  };

  // Auto-open when connected
  useEffect(() => {
    if (state.isConnected && isMinimized) {
      setIsMinimized(false);
    }
  }, [state.isConnected, isMinimized]);

  return (
    <RoomContext.Provider value={convaiClient.room}>
      <div className="relative rounded-4xl glass" style={{width: "40vw",maxWidth: "550px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        {/* Header */}
        <div className="rounded-t-2xl flex items-center justify-around">
        </div>

        {/* Chat Container */}
        <div
          className={`rounded-b-2xl overflow-hidden transition-all duration-300 ${
            isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
          }`}
          style={{
            minHeight: 190,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-900/20 h-[320px] scrollbar-thin scrollbar-thumb-emerald-500/30 scrollbar-track-transparent"
                style={{
                  maxHeight: "500px",
                  overflowY: "scroll",
                }}
              >
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div
                      className="text-center text-slate-400"
                      style={{
                        paddingTop: "20px",
                      }}
                    >
                      <p className="text-sm font-semibold text-slate-300">
                        Ready to Chat
                      </p>
                      <p className="text-xs opacity-75 max-w-48">
                        Click connect to start your conversation with the AI
                        assistant
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      height: "400px !important",
                      overflowY: "scroll",
                    }}
                  >
                    {filteredChatMessages.map((message, index) =>
                      renderMessage(message, index),
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Control Bar */}
              <div className="p-4 border-emerald-500/20 bg-slate-900/30">
                {!state.isConnected ? (
                  <button
                    onClick={onConnect}
                    disabled={state.isConnecting}
                    className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-500/50 disabled:to-emerald-600/50 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 btn-hover-lift"
                  >
                    {state.isConnecting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        Connect To Convai
                      </div>
                    )}
                  </button>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {/* Microphone Button */}
                    <button
                      onClick={() => audioControls.toggleAudio()}
                      className={`px-3 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 text-white ${
                        audioControls.isAudioMuted
                          ? "bg-red-500/20 border border-red-500/30 hover:bg-red-500/30"
                          : "bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30"
                      }`}
                      title={audioControls.isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
                    >
                      <MicrophoneIcon width={24} height={24} />
                    </button>

                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      disabled={isSending}
                      className="px-4 py-3 rounded-lg flex-1"
                      style={{
                        color: "black",
                        outline: "none",
                        flex: 1,
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isSending}
                      className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-500/30 disabled:to-emerald-600/30 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 btn-hover-lift disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-lg animate-spin"></div>
                      ) : (
                        <>Send</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Audio Renderer - Crucial for audio playback */}
        <RoomAudioRenderer />
      </div>
    </RoomContext.Provider>
  );
};
