import React, { useState, useRef, useEffect } from 'react';
import { ConvaiClient, ChatMessage } from '../types';
import {
  RoomContext,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  DisconnectButton
} from '@livekit/components-react';
import { CloseIcon } from './CloseIcon';

interface ChatBotProps {
  convaiClient: ConvaiClient & { activity?: string };
  onConnect: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ convaiClient, onConnect }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { state, activity, chatMessages } = convaiClient;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [chatMessages]);

  // Simulate typing indicator for Convai messages
  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage.type === 'convai') {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [chatMessages]);

  const getStatusColor = () => {
    if (state.isConnected) return 'bg-emerald-400 shadow-emerald-400/50';
    if (state.isConnecting) return 'bg-yellow-400 shadow-yellow-400/50';
    return 'bg-slate-400 shadow-slate-400/50';
  };

  const getStatusText = () => {
    if (state.isConnected) return 'Connected';
    if (state.isConnecting) return 'Connecting...';
    return 'Disconnected';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isLastMessage = index === chatMessages.length - 1;
    
    switch (message.type) {
      case 'user':
        return (
          <div key={message.id} className="flex justify-end mb-4 animate-in slide-in-from-right-2 duration-300">
            <div className="flex flex-col items-end max-w-[85%]">
              <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm">
                <p className="text-emerald-100 text-sm leading-relaxed">{message.content}</p>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-emerald-400/60 text-xs font-medium">You</span>
                <span className="text-emerald-400/40 text-xs">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          </div>
        );

      case 'convai':
        return (
          <div key={message.id} className="flex justify-start mb-4 animate-in slide-in-from-left-2 duration-300">
            <div className="flex flex-col items-start max-w-[85%]">
              <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-600/30 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm">
                <p className="text-slate-100 text-sm leading-relaxed">{message.content}</p>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400/60 text-xs font-medium">Assistant</span>
                <span className="text-slate-400/40 text-xs">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          </div>
        );

      case 'emotion':
        return (
          <div key={message.id} className="flex justify-center mb-3 animate-in fade-in duration-500">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm">
              <p className="text-purple-200 text-sm font-medium">😊 {message.content}</p>
            </div>
          </div>
        );

      case 'behavior-tree':
        return (
          <div key={message.id} className="flex justify-center mb-3 animate-in fade-in duration-500">
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm">
              <p className="text-blue-200 text-sm font-medium">🌳 {message.content}</p>
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
              <div className={`w-3 h-3 ${getStatusColor()} rounded-full animate-pulse shadow-lg`}></div>
              <div className="flex flex-col">
                <span className="text-slate-200 text-sm font-semibold">Voice Assistant</span>
                <span className="text-slate-400 text-xs">{getStatusText()}</span>
              </div>
              {activity && (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-xs font-medium">{activity}</span>
                </div>
              )}
            </div>
                         <button
               onClick={() => setIsMinimized(!isMinimized)}
               className="p-2 hover:bg-emerald-500/20 rounded-xl transition-all duration-200 text-slate-300 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 btn-hover-lift"
             >
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className={`glass rounded-b-2xl overflow-hidden transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-900/20 h-[380px] scrollbar-thin scrollbar-thumb-emerald-500/30 scrollbar-track-transparent"
              >
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-slate-400">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold mb-1 text-slate-300">Ready to Chat</p>
                      <p className="text-xs opacity-75 max-w-48">Click connect to start your conversation with the AI assistant</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {chatMessages.map((message, index) => renderMessage(message, index))}
                    
                                         {/* Typing Indicator */}
                     {isTyping && (
                       <div className="flex justify-start mb-4 animate-in slide-in-from-left-2 duration-300">
                         <div className="flex flex-col items-start max-w-[85%]">
                           <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-600/30 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm">
                             <div className="flex space-x-1">
                               <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                               <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                               <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                             </div>
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
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>Start Conversation</span>
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center justify-between space-x-3">
                    {/* Voice Assistant Controls */}
                    <div className="flex-1">
                      <VoiceAssistantControlBar 
                        controls={{ leave: false }}
                        className="flex items-center justify-center"
                      />
                    </div>
                    
                                         {/* Disconnect Button */}
                     <DisconnectButton className="p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all duration-200 text-red-300 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 btn-hover-lift">
                       <CloseIcon />
                     </DisconnectButton>
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