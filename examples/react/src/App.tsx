
import {
  BarVisualizer,
  VideoTrack,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { RoomEvent } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import {
  CloseIcon,
  NoAgentNotification,
  TranscriptionView,
  LocalVideoDisplay,
  VideoControls,
  RTVITriggerControls,
  useConvaiClient,
} from "airsurfer-livekit-react";
import "./App.css";

export default function App() {
  // Use the unified client
  const convaiClient = useConvaiClient();

  const onConnectButtonClicked = useCallback(async () => {
    try {
      await convaiClient.connect({
        apiKey: 'ea401720eb28daa6810bab6508b4188f',
        characterId: '6bae239c-11ab-11ef-9870-42010a7be00e',
        enableVideo: true,
        enableAudio: true,
        llmProvider: 'gemini-baml',
        actionConfig: {
          actions: [
            "Wave",
            "Flip your hair",
            "Touch user's hair",
          ],
          characters: [
            {
              name: "Ty",
              bio: "Ty is an AI powered virtual hair stylist trained on 60+ decades of TRESemmé expert hair knowledge. She gives personalized, on-demand hair styling advice that people can relate to, as well as answering questions about TRESemmé and TRESemmé products.",
            },
            { name: "Player", bio: "" },
          ],
          objects: [
            { name: "Tresseme shampoo", description: "A shampoo bottle" },
            { name: "Tresseme conditioner", description: "A conditioner bottle" },
            { name: "Tresseme hairspray", description: "A hairspray bottle" },
          ],
          currentAttentionObject: "Tresseme shampoo",
        },
      });
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }, [convaiClient]);

  useEffect(() => {
    if (convaiClient.room) {
      convaiClient.room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

      return () => {
        convaiClient.room?.off(RoomEvent.MediaDevicesError, onDeviceFailure);
      };
    }
  }, [convaiClient.room]);

  return (
    <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
      <div className="lk-room-container max-w-[1024px] w-[90vw] mx-auto max-h-[90vh]">
        <SimpleVoiceAssistant onConnectButtonClicked={onConnectButtonClicked} convaiClient={convaiClient} />
      </div>
    </main>
  );
}

function SimpleVoiceAssistant(props: { 
  onConnectButtonClicked: () => void;
  convaiClient: any;
}) {
  const { state: agentState } = props.convaiClient.state;

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
              onClick={() => props.onConnectButtonClicked()}
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
              <LocalVideoDisplay room={props.convaiClient.room} />
            </div>
            
            <AgentVisualizer convaiClient={props.convaiClient} />
            <div className="flex-1 w-full">
              <TranscriptionView transcriptions={props.convaiClient.transcriptions} />
            </div>
            
            {/* RTVI Trigger Controls */}
            <div className="w-full max-w-[512px]">
              <RTVITriggerControls 
                sendRTVI={props.convaiClient.sendRTVI}
                isConnected={props.convaiClient.state.isConnected}
              />
            </div>
            
            <div className="w-full">
              <ControlBar onConnectButtonClicked={props.onConnectButtonClicked} convaiClient={props.convaiClient} />
            </div>
            <NoAgentNotification state={agentState} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AgentVisualizer(props: { convaiClient: any }) {
  const { videoTrack, audioTrack } = props.convaiClient;
  const { agentState } = props.convaiClient.state;

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
}

function ControlBar(props: { 
  onConnectButtonClicked: () => void;
  convaiClient: any;
}) {
  const { agentState } = props.convaiClient.state;

  return (
    <div className="relative h-[60px]">
      <AnimatePresence>
        {agentState === "disconnected" && (
          <motion.button
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
            onClick={() => props.onConnectButtonClicked()}
          >
            Start a conversation
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-8 absolute left-1/2 -translate-x-1/2 justify-center items-center gap-2"
          >
            <VideoControls room={props.convaiClient.room} />
            <button
              onClick={props.convaiClient.disconnect}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              <CloseIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}

