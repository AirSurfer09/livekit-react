# Airsurfer LiveKit React

A React package for integrating Convai's AI-powered voice assistants to web for real-time audio/video conversations.

## Features

- 🎤 Real-time voice conversations with AI assistants
- 📹 Video streaming support
- 💬 Chat interface with message history
- 🎯 Trigger message support
- 🔑 Template keys management
- 🔄 Dynamic info updates
- 🎭 Action responses
- 🌳 Behavior tree responses
- 🛡️ Moderation responses

## Installation

```bash
npm install airsurfer-livekit-react
```

## Environment Configuration

### Development Logging

To enable detailed logging in development mode, create a `.env` file in your project root:

```bash
# Copy the example environment file
cp env.example .env
```

The `.env` file should contain:
```env
NODE_ENV=development
REACT_APP_ENV=development
```

### Logging Levels

- **Development Mode**: All colored console logs are displayed
- **Production Mode**: No console logs are displayed (clean production builds)

## Usage

### Basic Setup

```tsx
import { useConvaiClient, ChatBot } from 'airsurfer-livekit-react';

function App() {
  const convaiClient = useConvaiClient();

  const connect = async () => {
    await convaiClient.connect({
      apiKey: 'your-api-key',
      characterId: 'your-character-id',
      enableVideo: true,
      enableAudio: true,
    });
  };

  return (
    <div>
      <ChatBot convaiClient={convaiClient} onConnect={connect} />
    </div>
  );
}
```

### Message Types

The library handles various message types:

#### User Messages (Chat UI)
- **🎤 User Transcriptions**: Speech-to-text transcriptions (shown in chat)
- **🚫 User Text Messages**: Programmatic text messages (sent to Convai, not shown in chat)

#### Assistant Messages (Chat UI)
- **🤖 Convai Messages**: Assistant responses
- **😊 Convai Emotions**: Bot emotion states

#### System Messages (Client Access Only)
- **🎭 Action Responses**: Character actions
- **🌳 Behavior Tree Responses**: Narrative responses
- **🛡️ Moderation Responses**: Content moderation
- **🎯 Trigger Messages**: System triggers
- **🔑 Template Keys**: Template updates
- **🔄 Dynamic Info**: Dynamic information updates

### API Reference

#### useConvaiClient()

Returns a Convai client with the following methods:

```tsx
const {
  state,                    // Connection state
  connect,                  // Connect to Convai
  disconnect,               // Disconnect from Convai
  room,                     // LiveKit room instance
  sendUserTextMessage,      // Send text message (not shown in chat)
  sendTriggerMessage,       // Send trigger message
  updateTemplateKeys,       // Update template keys
  updateDynamicInfo,        // Update dynamic info
  activity,                 // Current activity status
  chatMessages,             // Chat message history
  audioControls,            // Audio control methods
  videoControls,            // Video control methods
} = useConvaiClient();
```

#### Configuration Options

```tsx
interface ConvaiConfig {
  apiKey: string;                    // Required: Your Convai API key
  characterId: string;               // Required: Character ID
  url?: string;                      // Optional: Custom API URL
  enableVideo?: boolean;             // Optional: Enable video (default: true)
  enableAudio?: boolean;             // Optional: Enable audio (default: true)
  llmProvider?: string;              // Optional: LLM provider (default: "gemini-baml")
  actionConfig?: ActionConfig;       // Optional: Action configuration
}
```

### Components

#### FloatingVideoDisplay

A floating video display component that shows the local camera feed with optional mirroring.

```tsx
import { FloatingVideoDisplay } from 'airsurfer-livekit-react';

function App() {
  const [isVideoMirrored, setIsVideoMirrored] = useState(false);
  
  return (
    <FloatingVideoDisplay
      room={convaiClient.room}
      videoTrack={convaiClient.videoTrack}
      mirror={isVideoMirrored} // Enable horizontal mirroring
    />
  );
}
```

**Props:**
- `room?: Room | null` - LiveKit room instance
- `videoTrack?: any` - Video track reference
- `mirror?: boolean` - Whether to mirror the video horizontally (default: false)

**Features:**
- 📹 Local camera feed display
- 🔄 Horizontal video mirroring (like a mirror reflection)
- 📱 Responsive design with expand/collapse functionality
- 🎨 Glass morphism UI styling

## Development

### Logging

In development mode, you'll see colored console logs for:

- 📨 **Incoming Messages**: All received messages
- 💬 **User Messages**: Text messages sent
- 🎤 **User Transcriptions**: Speech transcriptions
- 🤖 **Convai Messages**: Assistant responses
- 😊 **Convai Emotions**: Bot emotions
- 🎭 **Action Responses**: Character actions
- 🌳 **Behavior Tree**: Narrative responses
- 🛡️ **Moderation**: Content moderation
- 🚫 **Skipped Messages**: Duplicate prevention
- 🔍 **Unhandled Types**: Unknown message types

### Building

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test
```

## License

MIT 