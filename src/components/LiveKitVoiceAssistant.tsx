import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVoiceAssistant } from '@livekit/components-react';
import { 
  LiveKitManagerProvider, 
  LiveKitAudioRenderer, 
  LiveKitAgentVisualizer, 
  LiveKitControlBar,
  LiveKitConfig,
  useLiveKitManager
} from '../managers/LiveKitManager';
import {
  TranscriptionView,
  LocalVideoDisplay,
  RTVITriggerControls,
  VideoControls,
  NoAgentNotification,
} from './index';
import { useDataMessageListener } from '../hooks';

interface LiveKitVoiceAssistantProps {
  children?: React.ReactNode;
  onConnect: () => void;
  config: LiveKitConfig;
}

const VoiceAssistantContent: React.FC<{ onConnect: () => void; config: LiveKitConfig }> = ({ onConnect, config }) => {
  const { state: agentState } = useVoiceAssistant();
  const { connect } = useLiveKitManager();

  const handleConnect = async () => {
    try {
      await connect(config);
      onConnect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {agentState === "disconnected" ? (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="grid items-center justify-center h-full"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="uppercase px-4 py-2 bg-white text-black rounded-md"
              onClick={handleConnect}
            >
              Start a conversation
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex flex-col items-center gap-4 h-full relative"
          >
            {/* Local video display in top-right corner */}
            <div className="absolute top-4 right-4 z-10">
              <LocalVideoDisplay />
            </div>
            
            <LiveKitAgentVisualizer />
            <div className="flex-1 w-full">
              <TranscriptionView />
            </div>
            
            {/* RTVI Trigger Controls */}
            <div className="w-full max-w-[512px]">
              <RTVITriggerControls />
            </div>
            
            <div className="w-full">
              <LiveKitControlBar onConnect={onConnect} />
            </div>
            <LiveKitAudioRenderer />
            <NoAgentNotification state={agentState} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const LiveKitVoiceAssistant: React.FC<LiveKitVoiceAssistantProps> = ({ 
  children, 
  onConnect,
  config
}) => {
  return (
    <LiveKitManagerProvider>
      <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
        <div className="lk-room-container max-w-[1024px] w-[90vw] mx-auto max-h-[90vh]">
          <VoiceAssistantContent onConnect={onConnect} config={config} />
          <DataMessageListener />
          {children}
        </div>
      </main>
    </LiveKitManagerProvider>
  );
};

// Component to initialize data message listener
const DataMessageListener: React.FC = () => {
  useDataMessageListener();
  return null; // This component doesn't render anything
}; 