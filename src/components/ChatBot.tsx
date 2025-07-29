import React, { useState, useRef, useEffect } from "react";
import { ConvaiClient, ChatMessage } from "../types";
import {
  RoomContext,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  DisconnectButton,
} from "@livekit/components-react";
import { CloseIcon } from "./CloseIcon";

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
  const { state, activity, chatMessages, sendUserTextMessage } = convaiClient;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatMessages]);

  // Simulate typing indicator for Convai messages
  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage.type === "convai") {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [chatMessages]);

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
    const isLastMessage = index === chatMessages.length - 1;

    switch (message.type) {
      case "user":
        return (
          <div
            key={message.id}
            className="flex justify-end mb-6 animate-in slide-in-from-right-2 duration-300"
          >
            <div className="flex flex-col items-end max-w-[85%]">
              <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm">
                <p className="text-emerald-100 text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-emerald-400/60 text-xs font-medium">
                  You
                </span>
                <span className="text-emerald-400/40 text-xs">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        );

      case "convai":
        return (
          <div
            key={message.id}
            className="flex justify-start mb-6 animate-in slide-in-from-left-2 duration-300"
          >
            <div className="flex flex-col items-start max-w-[85%]">
              <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-600/30 rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm">
                <p className="text-slate-100 text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400/60 text-xs font-medium">
                  Assistant
                </span>
                <span className="text-emerald-400/40 text-xs">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        );

      case "emotion":
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

      case "behavior-tree":
        return (
          <div
            key={message.id}
            className="flex justify-center mb-4 animate-in fade-in duration-500"
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm">
              <p className="text-blue-200 text-sm font-medium">
                🌳 {message.content}
              </p>
            </div>
          </div>
        );

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
      <div className="relative">
        {/* Header */}
        <div className="glass-light rounded-t-2xl px-4 py-3 mb-2 border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 ${getStatusColor()} rounded-full animate-pulse shadow-lg`}
              ></div>
              <div className="flex flex-col">
                <span className="text-slate-200 text-sm font-semibold">
                  Voice Assistant
                </span>
                <span className="text-slate-400 text-xs">
                  {getStatusText()}
                </span>
              </div>
              {activity && (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-xs font-medium">
                    {activity}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-emerald-500/20 rounded-xl transition-all duration-200 text-slate-300 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 btn-hover-lift"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isMinimized ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div
          className={`glass rounded-b-2xl overflow-hidden transition-all duration-300 ${
            isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
          }`}
        >
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-900/20 h-[320px] scrollbar-thin scrollbar-thumb-emerald-500/30 scrollbar-track-transparent"
              >
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-slate-400">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center">
                        <svg
                          width="100%"
                          height="48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-emerald-400"
                        >
                          <path
                            d="M37.47 20c-1.348 0-2.565-.277-3.651-.832a6.33 6.33 0 0 1-2.585-2.413c-.618-1.055-.927-2.321-.927-3.8v-.39c0-1.479.31-2.745.927-3.8a6.33 6.33 0 0 1 2.585-2.413c1.086-.554 2.303-.832 3.651-.832 1.33 0 2.463.231 3.399.694.955.462 1.723 1.1 2.303 1.914.58.795.955 1.692 1.124 2.69l-3.118.638a3.937 3.937 0 0 0-.534-1.553 2.97 2.97 0 0 0-1.208-1.137c-.505-.278-1.133-.416-1.882-.416-.767 0-1.46.166-2.078.499-.6.314-1.077.795-1.433 1.442-.337.647-.505 1.424-.505 2.33v.278c0 .906.168 1.683.505 2.33.356.629.834 1.11 1.433 1.442.618.333 1.31.5 2.078.5 1.143 0 2.004-.287 2.585-.86.599-.592.973-1.35 1.123-2.275l3.118.721a7.207 7.207 0 0 1-1.208 2.635c-.58.796-1.348 1.434-2.303 1.915-.936.462-2.07.693-3.399.693ZM52.761 20c-1.386 0-2.63-.277-3.736-.832a6.586 6.586 0 0 1-2.584-2.413c-.618-1.055-.927-2.312-.927-3.773v-.444c0-1.46.309-2.718.927-3.772a6.33 6.33 0 0 1 2.584-2.414c1.105-.554 2.35-.832 3.736-.832 1.386 0 2.622.278 3.708.832a6.146 6.146 0 0 1 2.556 2.414c.637 1.054.955 2.311.955 3.772v.444c0 1.46-.318 2.718-.955 3.773a6.387 6.387 0 0 1-2.556 2.413c-1.086.555-2.322.832-3.708.832Zm0-2.83c1.18 0 2.144-.37 2.893-1.109.75-.758 1.124-1.812 1.124-3.162v-.278c0-1.35-.375-2.395-1.124-3.134-.749-.758-1.713-1.137-2.893-1.137-1.18 0-2.144.379-2.893 1.137-.75.74-1.124 1.784-1.124 3.134v.278c0 1.35.375 2.404 1.124 3.162.749.74 1.713 1.11 2.893 1.11ZM62.08 19.612V5.908h3.175v1.914h.477c.244-.517.684-1.007 1.32-1.47.637-.462 1.601-.693 2.894-.693 1.067 0 2.013.24 2.837.721a4.936 4.936 0 0 1 1.91 1.997c.468.85.702 1.859.702 3.024v8.21h-3.23v-7.96c0-1.11-.281-1.933-.843-2.47-.543-.554-1.32-.831-2.331-.831-1.143 0-2.042.379-2.697 1.137-.655.74-.983 1.803-.983 3.19v6.935h-3.23ZM81.09 19.612 76.54 5.908h3.426l3.427 11.374h.478l3.455-11.374h3.426l-4.55 13.704H81.09ZM97.702 20c-1.143 0-2.2-.268-3.174-.804-.956-.555-1.723-1.36-2.304-2.414-.58-1.054-.87-2.32-.87-3.8v-.444c0-1.48.29-2.746.87-3.8.58-1.054 1.358-1.85 2.332-2.386a6.25 6.25 0 0 1 3.146-.832c1.31 0 2.312.222 3.005.666.693.444 1.208.952 1.545 1.526h.478V5.908h3.146v10.236c0 .555.262.832.786.832h1.152v2.636h-2.613c-.674 0-1.226-.185-1.657-.555-.412-.37-.618-.878-.618-1.526v-.083h-.477c-.319.684-.843 1.285-1.573 1.803-.731.5-1.789.749-3.174.749Zm.955-2.774c1.18 0 2.144-.37 2.893-1.11.768-.758 1.152-1.83 1.152-3.217v-.278c0-1.405-.384-2.478-1.152-3.217-.768-.74-1.732-1.11-2.893-1.11-1.161 0-2.135.37-2.922 1.11-.767.74-1.151 1.812-1.151 3.217v.278c0 1.387.384 2.46 1.151 3.217.787.74 1.76 1.11 2.922 1.11ZM109.264 19.612V5.908h3.23v13.704h-3.23Zm1.601-15.451c-.58 0-1.086-.185-1.517-.555-.412-.388-.618-.897-.618-1.526 0-.628.206-1.128.618-1.497A2.194 2.194 0 0 1 110.865 0c.618 0 1.124.194 1.517.583.412.37.618.869.618 1.497 0 .63-.206 1.138-.618 1.526-.393.37-.899.555-1.517.555Z"
                            fill="currentColor"
                          ></path>
                          <rect
                            x="7.443"
                            y="10.226"
                            width="9.41"
                            height="9.293"
                            rx="1.268"
                            fill="#34FF7A"
                          ></rect>
                          <rect
                            x="16.572"
                            y="3.292"
                            width="6.601"
                            height="6.519"
                            rx="1.268"
                            fill="#34FF7A"
                          ></rect>
                          <path
                            d="m16.572 8.353 1.685 1.456s-.54.022-.851.483c-.311.46-.553 1.32-.553 1.32l-1.756-1.387s.925-.18 1.236-.64c.311-.461.239-1.232.239-1.232Z"
                            fill="#34FF7A"
                          ></path>
                          <g opacity=".3" fill="#34FF7A">
                            <rect
                              x="11.293"
                              y="7.466"
                              width="6.756"
                              height="6.672"
                              rx="1.268"
                              transform="rotate(-180 11.293 7.466)"
                            ></rect>
                            <rect
                              x="4.739"
                              y="12.396"
                              width="4.739"
                              height="4.68"
                              rx="1.268"
                              transform="rotate(180 4.74 12.396)"
                            ></rect>
                            <path d="M4.74 8.758 3.53 7.712s.387-.015.61-.346c.224-.33.398-.948.398-.948l1.26.996s-.663.13-.887.46c-.224.33-.171.884-.171.884Z"></path>
                          </g>
                        </svg>
                      </div>
                      <p className="text-sm font-semibold mb-1 text-slate-300">
                        Ready to Chat
                      </p>
                      <p className="text-xs opacity-75 max-w-48">
                        Click connect to start your conversation with the AI
                        assistant
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {chatMessages.map((message, index) =>
                      renderMessage(message, index),
                    )}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start mb-6 animate-in slide-in-from-left-2 duration-300">
                        <div className="flex flex-col items-start max-w-[85%]">
                          <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-600/30 rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                            </div>
                          </div>
                          <div className="flex items-center mt-2 space-x-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-slate-400/60 text-xs font-medium">
                              Assistant
                            </span>
                            <span className="text-emerald-400/40 text-xs">
                              typing...
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Control Bar */}
              <div className="p-4 border-t border-emerald-500/20 bg-slate-900/30">
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
                        <svg
                          width="20%"
                          height="24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white"
                        >
                          <path
                            d="M37.47 20c-1.348 0-2.565-.277-3.651-.832a6.33 6.33 0 0 1-2.585-2.413c-.618-1.055-.927-2.321-.927-3.8v-.39c0-1.479.31-2.745.927-3.8a6.33 6.33 0 0 1 2.585-2.413c1.086-.554 2.303-.832 3.651-.832 1.33 0 2.463.231 3.399.694.955.462 1.723 1.1 2.303 1.914.58.795.955 1.692 1.124 2.69l-3.118.638a3.937 3.937 0 0 0-.534-1.553 2.97 2.97 0 0 0-1.208-1.137c-.505-.278-1.133-.416-1.882-.416-.767 0-1.46.166-2.078.499-.6.314-1.077.795-1.433 1.442-.337.647-.505 1.424-.505 2.33v.278c0 .906.168 1.683.505 2.33.356.629.834 1.11 1.433 1.442.618.333 1.31.5 2.078.5 1.143 0 2.004-.287 2.585-.86.599-.592.973-1.35 1.123-2.275l3.118.721a7.207 7.207 0 0 1-1.208 2.635c-.58.796-1.348 1.434-2.303 1.915-.936.462-2.07.693-3.399.693ZM52.761 20c-1.386 0-2.63-.277-3.736-.832a6.586 6.586 0 0 1-2.584-2.413c-.618-1.055-.927-2.312-.927-3.773v-.444c0-1.46.309-2.718.927-3.772a6.33 6.33 0 0 1 2.584-2.414c1.105-.554 2.35-.832 3.736-.832 1.386 0 2.622.278 3.708.832a6.146 6.146 0 0 1 2.556 2.414c.637 1.054.955 2.311.955 3.772v.444c0 1.46-.318 2.718-.955 3.773a6.387 6.387 0 0 1-2.556 2.413c-1.086.555-2.322.832-3.708.832Zm0-2.83c1.18 0 2.144-.37 2.893-1.109.75-.758 1.124-1.812 1.124-3.162v-.278c0-1.35-.375-2.395-1.124-3.134-.749-.758-1.713-1.137-2.893-1.137-1.18 0-2.144.379-2.893 1.137-.75.74-1.124 1.784-1.124 3.134v.278c0 1.35.375 2.404 1.124 3.162.749.74 1.713 1.11 2.893 1.11ZM62.08 19.612V5.908h3.175v1.914h.477c.244-.517.684-1.007 1.32-1.47.637-.462 1.601-.693 2.894-.693 1.067 0 2.013.24 2.837.721a4.936 4.936 0 0 1 1.91 1.997c.468.85.702 1.859.702 3.024v8.21h-3.23v-7.96c0-1.11-.281-1.933-.843-2.47-.543-.554-1.32-.831-2.331-.831-1.143 0-2.042.379-2.697 1.137-.655.74-.983 1.803-.983 3.19v6.935h-3.23ZM81.09 19.612 76.54 5.908h3.426l3.427 11.374h.478l3.455-11.374h3.426l-4.55 13.704H81.09ZM97.702 20c-1.143 0-2.2-.268-3.174-.804-.956-.555-1.723-1.36-2.304-2.414-.58-1.054-.87-2.32-.87-3.8v-.444c0-1.48.29-2.746.87-3.8.58-1.054 1.358-1.85 2.332-2.386a6.25 6.25 0 0 1 3.146-.832c1.31 0 2.312.222 3.005.666.693.444 1.208.952 1.545 1.526h.478V5.908h3.146v10.236c0 .555.262.832.786.832h1.152v2.636h-2.613c-.674 0-1.226-.185-1.657-.555-.412-.37-.618-.878-.618-1.526v-.083h-.477c-.319.684-.843 1.285-1.573 1.803-.731.5-1.789.749-3.174.749Zm.955-2.774c1.18 0 2.144-.37 2.893-1.11.768-.758 1.152-1.83 1.152-3.217v-.278c0-1.405-.384-2.478-1.152-3.217-.768-.74-1.732-1.11-2.893-1.11-1.161 0-2.135.37-2.922 1.11-.767.74-1.151 1.812-1.151 3.217v.278c0 1.387.384 2.46 1.151 3.217.787.74 1.76 1.11 2.922 1.11ZM109.264 19.612V5.908h3.23v13.704h-3.23Zm1.601-15.451c-.58 0-1.086-.185-1.517-.555-.412-.388-.618-.897-.618-1.526 0-.628.206-1.128.618-1.497A2.194 2.194 0 0 1 110.865 0c.618 0 1.124.194 1.517.583.412.37.618.869.618 1.497 0 .63-.206 1.138-.618 1.526-.393.37-.899.555-1.517.555Z"
                            fill="currentColor"
                          ></path>
                          <rect
                            x="7.443"
                            y="10.226"
                            width="9.41"
                            height="9.293"
                            rx="1.268"
                            fill="#34FF7A"
                          ></rect>
                          <rect
                            x="16.572"
                            y="3.292"
                            width="6.601"
                            height="6.519"
                            rx="1.268"
                            fill="#34FF7A"
                          ></rect>
                          <path
                            d="m16.572 8.353 1.685 1.456s-.54.022-.851.483c-.311.46-.553 1.32-.553 1.32l-1.756-1.387s.925-.18 1.236-.64c.311-.461.239-1.232.239-1.232Z"
                            fill="#34FF7A"
                          ></path>
                          <g opacity=".3" fill="#34FF7A">
                            <rect
                              x="11.293"
                              y="7.466"
                              width="6.756"
                              height="6.672"
                              rx="1.268"
                              transform="rotate(-180 11.293 7.466)"
                            ></rect>
                            <rect
                              x="4.739"
                              y="12.396"
                              width="4.739"
                              height="4.68"
                              rx="1.268"
                              transform="rotate(180 4.74 12.396)"
                            ></rect>
                            <path d="M4.74 8.758 3.53 7.712s.387-.015.61-.346c.224-.33.398-.948.398-.948l1.26.996s-.663.13-.887.46c-.224.33-.171.884-.171.884Z"></path>
                          </g>
                        </svg>
                        <span>Connect To Convai</span>
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      disabled={isSending}
                      className="flex-1 px-4 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 backdrop-blur-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isSending}
                      className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-500/30 disabled:to-emerald-600/30 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 btn-hover-lift disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
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
