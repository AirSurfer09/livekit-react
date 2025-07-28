# Airsurfer LiveKit React

A React package for integrating Convai's AI-powered voice assistants with LiveKit for real-time audio/video conversations.

## Quick Start

```tsx
import { useConvaiClient } from 'airsurfer-livekit-react';

function MyComponent() {
  const convaiClient = useConvaiClient();

  const startConversation = async () => {
    try {
      await convaiClient.connect({
        apiKey: 'your-api-key',
        characterId: 'your-character-id',
        enableVideo: true,
        enableAudio: true,
        llmProvider: 'gemini-baml', // optional, defaults to gemini-baml
        actionConfig: {
          actions: ['Wave', 'Point'],
          characters: [
            { name: 'Assistant', bio: 'A helpful AI assistant' },
            { name: 'User', bio: 'The user' }
          ],
          objects: [
            { name: 'Coffee Cup', description: 'A coffee cup' }
          ],
          currentAttentionObject: 'Coffee Cup'
        }
      });
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <div>
      {!convaiClient.state.isConnected ? (
        <button onClick={startConversation}>Start Conversation</button>
      ) : (
        <div>
          <p>Status: {convaiClient.state.agentState}</p>
          <button onClick={convaiClient.disconnect}>Disconnect</button>
          
          {/* Display chat messages */}
          {convaiClient.messages.map((message, index) => (
            <div key={index}>
              {message.user && <p>User: {message.user}</p>}
              {message.convai && <p>Assistant: {message.convai}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Configuration

### Required Fields
- `apiKey`: Your Convai API key
- `characterId`: The ID of the character to connect to

### Optional Fields
- `enableVideo`: Enable video (default: true)
- `enableAudio`: Enable audio (default: true)
- `url`: Custom core service URL (default: https://realtime-api.convai.com)
- `llmProvider`: LLM provider (default: gemini-baml)
- `actionConfig`: Configuration for RTVI actions and objects

## Client Interface

The `useConvaiClient` hook returns a client object with:

### State
- `state.isConnected`: Connection status
- `state.isConnecting`: Connecting status
- `state.agentState`: Current agent state (disconnected, connecting, listening, thinking, speaking)
- `state.isListening`: Whether the agent is listening
- `state.isThinking`: Whether the agent is thinking
- `state.isSpeaking`: Whether the agent is speaking

### Methods
- `connect(config)`: Connect to a character
- `disconnect()`: Disconnect from the current session
- `sendRTVI(triggerName, message?)`: Send RTVI trigger

### Data
- `messages`: Array of chat messages in format `{user?: string, convai?: string, timestamp: number, role: string}`
- `transcriptions`: Raw transcription segments
- `room`: LiveKit room instance
- `videoTrack`: Video track reference
- `audioTrack`: Audio track reference

## Advanced Usage

For advanced usage, you can also import individual components and hooks:

```tsx
import { 
  TranscriptionView, 
  LocalVideoDisplay, 
  VideoControls,
  RTVITriggerControls 
} from 'airsurfer-livekit-react';
```

## Examples

See the `examples/react` directory for a complete working example. 