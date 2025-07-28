import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  useConvaiClient,
  ChatBot,
  FloatingVideoDisplay,
} from "airsurfer-livekit-react";
import "./App.css";

export default function App() {
  const convaiClient = useConvaiClient();
  const [error, setError] = useState<string | null>(null);

  const onConnectButtonClicked = useCallback(async () => {
    setError(null);
    try {
      await convaiClient.connect({
        apiKey: "ea401720eb28daa6810bab6508b4188f", // Replace with your actual API key
        characterId: "6bae239c-11ab-11ef-9870-42010a7be00e", // Replace with your actual character ID
        enableVideo: true,
        enableAudio: true,
        llmProvider: "gemini-baml",
        actionConfig: {
          actions: ["Wave", "Flip your hair", "Touch user's hair"],
          characters: [
            {
              name: "Ty",
              bio: "Ty is an AI powered virtual hair stylist trained on 60+ decades of TRESemmé expert hair knowledge. She gives personalized, on-demand hair styling advice that people can relate to, as well as answering questions about TRESemmé and TRESemmé products.",
            },
            { name: "Player", bio: "" },
          ],
          objects: [
            { name: "Tresseme shampoo", description: "A shampoo bottle" },
            {
              name: "Tresseme conditioner",
              description: "A conditioner bottle",
            },
            { name: "Tresseme hairspray", description: "A hairspray bottle" },
          ],
          currentAttentionObject: "Tresseme shampoo",
        },
      });
    } catch (error) {
      console.error("Failed to connect:", error);
      setError(error instanceof Error ? error.message : "Connection failed");
    }
  }, [convaiClient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-300/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent mb-6 tracking-tight">
              Convai Handsfree
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 mx-auto rounded-full mb-8"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto"
          >
            A React package for integrating Convai's AI-powered voice assistants
            to web for real-time audio/video conversations.
          </motion.p>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300"
            >
              <p className="text-sm font-medium">Connection Error</p>
              <p className="text-xs opacity-75 mt-1">{error}</p>
            </motion.div>
          )}

          {!convaiClient.state.isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center space-x-3 text-slate-400">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium tracking-wide">
                  Ready to connect
                </span>
              </div>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Click the chat interface in the bottom right to start your
                conversation
              </p>
            </motion.div>
          )}

          {convaiClient.state.isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-3 px-6 py-3 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-2xl"
            >
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-medium">
                Connected & Ready
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Floating Video Display Container */}
      <div className="fixed bottom-5 left-5 z-[999]">
        <FloatingVideoDisplay
          room={convaiClient.room}
          videoTrack={convaiClient.videoTrack}
        />
      </div>

      {/* Floating Chat Container */}
      <div className="fixed bottom-5 right-5 z-[999]">
        <ChatBot
          convaiClient={convaiClient}
          onConnect={onConnectButtonClicked}
        />
      </div>
    </div>
  );
}
