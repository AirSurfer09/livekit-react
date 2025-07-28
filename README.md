# Airsurfer LiveKit React

A LiveKit React integration package for Convai, providing React components and hooks for building real-time communication applications with connection handling, chat transcriptions, and RTVI triggers.

## Features

- **Connection Management**: Complete Convai connection handling with Core Service API integration
- **Chat Transcriptions**: Real-time transcription display for both user and assistant messages
- **RTVI Triggers**: Send trigger messages and commands through LiveKit data channels
- **Local Video Display**: Show local camera feed with controls
- **Video Controls**: Toggle camera on/off functionality
- **Data Message Listener**: Listen to incoming WebRTC data messages
- **Agent Notifications**: Status notifications for agent connection
- **React Components**: Pre-built components for common UI patterns
- **Custom Hooks**: Easy-to-use hooks for managing state and interactions
- **TypeScript Support**: Full type safety throughout the package
- **ESM-only Build**: Modern module system support

## Installation

```bash
pnpm install
```

## Development

```bash
# Install dependencies
pnpm examples:install

# Start development server
pnpm examples:dev

# Build the package
pnpm build

# Build examples
pnpm examples:build
```

## Usage

### Basic Connection

```typescript
import { useConvaiClient } from 'airsurfer-livekit-react';

function MyComponent() {
  const { connect, disconnect, isConnected, isConnecting } = useConvaiClient();

  const handleConnect = async () => {
    await connect({
      token: 'your-api-key',
      character_id: 'your-character-id',
      transport: 'livekit',
      connection_type: 'audio',
      llm_provider: 'gemini'
    });
  };

  return (
    <div>
      {!isConnected && (
        <button onClick={handleConnect}>Connect</button>
      )}
      {isConnected && (
        <button onClick={disconnect}>Disconnect</button>
      )}
    </div>
  );
}
```

### RTVI Triggers

```typescript
import { useRTVITriggerSender } from 'airsurfer-livekit-react';

function TriggerComponent() {
  const { sendTriggerByName, sendTriggerByMessage } = useRTVITriggerSender();

  const handleTrigger = async () => {
    await sendTriggerByName('ENTER_SPACESHIP');
  };

  return (
    <button onClick={handleTrigger}>
      Enter Spaceship
    </button>
  );
}
```

### Transcription View

```typescript
import { TranscriptionView } from 'airsurfer-livekit-react';

function ChatComponent() {
  return (
    <TranscriptionView 
      maxHeight="300px"
      maxWidth="600px"
    />
  );
}
```

### Complete Example

```typescript
import React from 'react';
import { RoomContext } from '@livekit/components-react';
import { 
  ConvaiClient, 
  RTVITriggerControls, 
  TranscriptionView,
  LocalVideoDisplay,
  VideoControls,
  CloseIcon,
  NoAgentNotification,
  useConvaiClient,
  useDataMessageListener
} from 'airsurfer-livekit-react';

function App() {
  const { connect, disconnect, isConnected, room } = useConvaiClient();

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect(config)}>Connect</button>
      ) : (
        <RoomContext.Provider value={room}>
          <ConvaiClient>
            <LocalVideoDisplay />
            <TranscriptionView />
            <RTVITriggerControls />
            <VideoControls />
            <NoAgentNotification state="connecting" />
            <DataMessageListener />
            <button onClick={disconnect}>
              <CloseIcon />
              Disconnect
            </button>
          </ConvaiClient>
        </RoomContext.Provider>
      )}
    </div>
  );
}

// Invisible component for data message listening
function DataMessageListener() {
  useDataMessageListener();
  return null;
}
```

### Local Video Display

```typescript
import { LocalVideoDisplay } from 'airsurfer-livekit-react';

function VideoComponent() {
  return (
    <div className="flex justify-center">
      <LocalVideoDisplay />
    </div>
  );
}
```

### Video Controls

```typescript
import { VideoControls } from 'airsurfer-livekit-react';

function ControlsComponent() {
  return (
    <div className="flex gap-4">
      <VideoControls />
      {/* Other controls */}
    </div>
  );
}
```

### Data Message Listening

```typescript
import { useDataMessageListener } from 'airsurfer-livekit-react';

function MessageListener() {
  const { isListening } = useDataMessageListener();
  
  return (
    <div>
      {isListening && <p>Listening for messages...</p>}
    </div>
  );
}
```

## API Reference

### Hooks

- `useConvaiClient()` - Main connection management hook
- `useRTVITriggerSender()` - RTVI trigger message sending
- `useCombinedTranscriptions()` - Combined user and assistant transcriptions
- `useLocalMicTrack()` - Local microphone track reference
- `useLocalCameraTrack()` - Local camera track reference
- `useDataMessageListener()` - Listen to incoming data messages

### Components

- `ConvaiClient` - Main wrapper component
- `RTVITriggerControls` - UI for sending RTVI triggers
- `TranscriptionView` - Display for chat transcriptions
- `LocalVideoDisplay` - Local camera feed display
- `VideoControls` - Camera toggle controls
- `CloseIcon` - Simple close icon component
- `NoAgentNotification` - Agent connection status notification

### Types

- `ConvaiConfig` - Configuration for connection
- `ConnectionData` - Response data from connection
- `TriggerPayload` - RTVI trigger message payload
- `TranscriptionSegment` - Individual transcription segment
- `DataMessage` - Incoming data message structure
- `AgentState` - Agent connection state
- `VideoTrackRef` - Video track reference

## Examples

The package includes a complete React example in the `examples/react` directory that demonstrates:

- Connection setup and management
- Real-time transcription display
- RTVI trigger controls
- Error handling
- UI state management

## License

MIT 