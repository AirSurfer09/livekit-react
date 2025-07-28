
import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VideoTrack,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { Room, RoomEvent } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import {
  CloseIcon,
  NoAgentNotification,
  TranscriptionView,
  LocalVideoDisplay,
  VideoControls,
  RTVITriggerControls,
  useDataMessageListener,
} from "airsurfer-livekit-react";
import "./App.css";

// const CORE_SERVICE_URL = "https://realtime-api.convai.com:8000"
// const CORE_SERVICE_URL = "http://127.0.0.1:8000"
// const CORE_SERVICE_URL = "http://35.237.31.101:8000"
const CORE_SERVICE_URL = "https://realtime-api.convai.com";

export default function App() {
  const [room] = useState(new Room());

  const onConnectButtonClicked = useCallback(async () => {
    try {
      // Call your Core Service API
      const response = await fetch(`${CORE_SERVICE_URL}/connect`, {
        method: "POST",
        headers: {
          // 'x-api-key': 'd0e7f7f5e533041738b2de59718417e7',
          // 'x-api-key': 'cdfb24c99142cdc8ecf9003498d14ca6',
          'x-api-key': 'ea401720eb28daa6810bab6508b4188f',
          // 'x-api-key': 'a72d09bff9b301b3bc7e6282886eb894',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // "character_id": "d2267f9e-4b15-11f0-9636-42010a7be01f",
          // "character_id": "700e3450-3242-11f0-a5ce-42010a7be01f",
          // "character_id": "77e036fc-8ae9-11ef-829a-42010a7be011",
          // 6bae239c-11ab-11ef-9870-42010a7be00e
          // "character_id": "350aec0c-deee-11ee-82ab-42010a7be009",
          "character_id": "6bae239c-11ab-11ef-9870-42010a7be00e",
          "transport": "livekit",
          "connection_type": "audio",
          "llm_provider": "gemini-baml",
          "action_config": {
            "actions": [
              "Wave",
              "Flip your hair",
              "Touch user's hair",
            ],
            "characters": [
              {
                "name": "Ty",
                "bio": "Ty is an AI powered virtual hair stylist trained on 60+ decades of TRESemmé expert hair knowledge. She gives personalized, on-demand hair styling advice that people can relate to, as well as answering questions about TRESemmé and TRESemmé products.",
              },
              { "name": "Player", "bio": "" },
            ],
            "objects": [
              { "name": "Tresseme shampoo", "description": "A shampoo bottle" },
              { "name": "Tresseme conditioner", "description": "A conditioner bottle" },
              { "name": "Tresseme hairspray", "description": "A hairspray bottle" },
            ],
            "current_attention_object": "Tresseme shampoo",
          },
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const connectionData = await response.json();
      console.log('Connection data received:', connectionData);
      
      // Connect using the room_url from the response instead of hardcoded LIVEKIT_URL
      await room.connect(
        connectionData.room_url,
        connectionData.token,
        {
          rtcConfig: {
            iceTransportPolicy: 'relay'
          }
        }
      );
      
      // Enable both microphone AND camera
      await room.localParticipant.setMicrophoneEnabled(true);
      await room.localParticipant.setCameraEnabled(true);
      
      // Store session_id for later use
      console.log('Connected to room:', connectionData.room_name);
      console.log('Session ID:', connectionData.session_id);
      
    } catch (error) {
      console.error('Connection failed:', error);
      // Handle error appropriately
    }
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  return (
    <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
      <RoomContext.Provider value={room}>
        <div className="lk-room-container max-w-[1024px] w-[90vw] mx-auto max-h-[90vh]">
          <SimpleVoiceAssistant onConnectButtonClicked={onConnectButtonClicked} />
          <DataMessageListener />
        </div>
      </RoomContext.Provider>
    </main>
  );
}

function SimpleVoiceAssistant(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant();

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
              <LocalVideoDisplay />
            </div>
            
            <AgentVisualizer />
            <div className="flex-1 w-full">
              <TranscriptionView />
            </div>
            
            {/* RTVI Trigger Controls */}
            <div className="w-full max-w-[512px]">
              <RTVITriggerControls />
            </div>
            
            <div className="w-full">
              <ControlBar onConnectButtonClicked={props.onConnectButtonClicked} />
            </div>
            <RoomAudioRenderer />
            <NoAgentNotification state={agentState} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AgentVisualizer() {
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
}

function ControlBar(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant();

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
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <VideoControls />
            <DisconnectButton>
              <CloseIcon />
            </DisconnectButton>
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

// Component to initialize data message listener
function DataMessageListener() {
  useDataMessageListener();
  return null; // This component doesn't render anything
}

