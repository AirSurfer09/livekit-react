import React, { useState } from 'react';
import { Room } from 'livekit-client';
import { VideoTrack, RoomContext, useVoiceAssistant, BarVisualizer } from '@livekit/components-react';
import { useLocalCameraTrack } from '../hooks/useLocalCameraTrack';

interface FloatingVideoDisplayProps {
  room?: Room | null;
  videoTrack?: any;
}

export const FloatingVideoDisplay: React.FC<FloatingVideoDisplayProps> = ({ 
  room, 
  videoTrack 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!room) {
    return (
      <div className="relative">
        <div className="glass-light rounded-t-2xl px-4 py-3 mb-2 border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <span className="text-slate-300 text-sm font-medium">Video</span>
            </div>
          </div>
        </div>
        <div className="glass rounded-b-2xl overflow-hidden w-80 h-16">
          <div className="flex items-center justify-center h-full bg-slate-900/50">
            <div className="flex items-center space-x-3 text-slate-400">
              <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Not Connected</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RoomContext.Provider value={room}>
      <div className="relative">
        {/* Status Banner - matching chat window */}
        <div className="glass-light rounded-t-2xl px-4 py-3 mb-2 border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-300 text-sm font-medium">Video</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="p-1.5 hover:bg-emerald-500/20 rounded-lg transition-all duration-200 text-slate-300 hover:text-emerald-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Video Area - matching chat window dimensions */}
        <div className={`glass rounded-b-2xl overflow-hidden transition-all duration-300 ${
          isExpanded ? 'w-[512px] h-[512px]' : 'w-80 h-16'
        }`}>
          {/* Video Content or Placeholder */}
          {!isExpanded ? (
            <div className="flex items-center justify-center h-full bg-slate-900/50">
              <div className="flex items-center space-x-3 text-slate-400">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Video</span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {/* Local video display in top-right corner - matching livekit-react-test */}
              <div className="absolute top-4 right-4 z-10">
                <LocalVideoDisplay />
              </div>
              
              {/* Main Agent Visualizer - matching livekit-react-test */}
              <div className="w-full h-full flex items-center justify-center">
                <AgentVisualizer />
              </div>
            </div>
          )}
        </div>
      </div>
    </RoomContext.Provider>
  );
};

// Local Video Display component - now includes agent visualizer when connected
const LocalVideoDisplay: React.FC = () => {
  const cameraTrackRef = useLocalCameraTrack();
  const { videoTrack } = useVoiceAssistant();

  if (!cameraTrackRef.publication?.isSubscribed) {
    return (
      <div className="w-48 h-36 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600">
        <span className="text-gray-400 text-sm">Camera Off</span>
      </div>
    );
  }

  return (
    <div className="w-48 h-36 rounded-lg overflow-hidden border-2 border-gray-600 relative">
      <VideoTrack trackRef={cameraTrackRef} />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        You
      </div>
      
      {/* Agent Video Track overlay - shows when agent has video */}
      {videoTrack && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="w-full h-full">
            <VideoTrack trackRef={videoTrack} />
          </div>
        </div>
      )}
    </div>
  );
};

// Agent Visualizer component - matching livekit-react-test exactly
const AgentVisualizer: React.FC = () => {
  const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();

  if (videoTrack) {
    return (
      <div className="h-[512px] w-[512px] rounded-lg overflow-hidden">
        <VideoTrack trackRef={videoTrack} />
      </div>
    );
  }
  
  return (
    <div className="h-[300px] w-full">
      <BarVisualizer
        state={agentState}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}; 