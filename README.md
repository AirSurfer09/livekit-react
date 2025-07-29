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
          {convaiClient.chatMessages.map((message, index) => (
            <div key={message.id}>
              {message.type === 'user' && <p>User: {message.content}</p>}
              {message.type === 'convai' && <p>Assistant: {message.content}</p>}
            </div>
          ))}
          
          {/* Text input for sending messages */}
          <div>
            <input 
              type="text" 
              placeholder="Type your message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  convaiClient.sendTextMessage(input.value);
                  input.value = '';
                }
              }}
            />
          </div>
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
- `sendTextMessage(text)`: Send a text message to the AI assistant

### Data
- `chatMessages`: Array of chat messages with structure `{id: string, type: 'user' | 'convai' | 'emotion' | 'behavior-tree', content: string, timestamp: string}`
- `messages`: Array of chat messages in format `{user?: string, convai?: string, timestamp: number, role: string}`
- `transcriptions`: Raw transcription segments
- `room`: LiveKit room instance
- `videoTrack`: Video track reference
- `audioTrack`: Audio track reference

## Components

### ChatBot Component

The `ChatBot` component provides a complete chat interface with text input:

```tsx
import { ChatBot } from 'airsurfer-livekit-react';

function MyApp() {
  const convaiClient = useConvaiClient();
  
  return (
    <ChatBot
      convaiClient={convaiClient}
      onConnect={() => convaiClient.connect(config)}
    />
  );
}
```

The ChatBot component includes:
- Real-time message display
- Text input for sending messages
- Connection status indicator
- Minimizable interface
- Typing indicators

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