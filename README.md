# @convai/web-handsfree

A React package for integrating Convai's AI-powered voice assistants with LiveKit for real-time audio/video conversations.

## Installation

```bash
npm install @convai/web-handsfree
```

## Quick Start

```tsx
import { useConvaiClient, ChatBot } from '@convai/web-handsfree';

function App() {
  const convaiClient = useConvaiClient();

  const connect = async () => {
    await convaiClient.connect({
      apiKey: 'your-convai-api-key',
      characterId: 'your-character-id',
      enableVideo: true,
      enableAudio: true,
    });
  };

  return (
    <ChatBot convaiClient={convaiClient} onConnect={connect} />
  );
}
```

## Setup

### Get Convai Credentials

1. Visit [convai.com](https://convai.com) and create an account
2. Navigate to your dashboard
3. Create a new character or use an existing one
4. Copy your API key and character ID

### Environment Configuration

Create a `.env` file in your project root:

```env
NODE_ENV=development
REACT_APP_ENV=development
```

## API Reference

### useConvaiClient()

Main hook for managing Convai connections.

```tsx
const {
  state,                    // Connection state
  connect,                  // Connect to Convai
  disconnect,               // Disconnect from Convai
  room,                     // LiveKit room instance
  sendUserTextMessage,      // Send text message
  sendTriggerMessage,       // Send trigger message
  updateTemplateKeys,       // Update template keys
  updateDynamicInfo,        // Update dynamic info
  activity,                 // Current activity status
  chatMessages,             // Chat message history
  audioControls,            // Audio control methods
  videoControls,            // Video control methods
} = useConvaiClient();
```

### Configuration

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

## Components

### ChatBot

Complete chat interface with message history and connection handling.

```tsx
<ChatBot 
  convaiClient={convaiClient} 
  onConnect={handleConnect} 
/>
```

### FloatingVideoDisplay

Floating video display with optional mirroring.

```tsx
<FloatingVideoDisplay
  room={convaiClient.room}
  videoTrack={convaiClient.videoTrack}
  mirror={true} // Enable horizontal mirroring
/>
```

## Development

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm
- Convai API key and character ID

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/convai/web-handsfree.git
cd web-handsfree
```

2. Install dependencies:
```bash
pnpm install
```

3. Build the package:
```bash
pnpm build
```

4. Run the example:
```bash
pnpm examples:dev
```

### Available Scripts

- `pnpm build` - Build the package
- `pnpm dev` - Watch mode for development
- `pnpm examples:dev` - Run the React example
- `pnpm examples:build` - Build the React example

## Contributing

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and releases.

### Making Changes

1. Create a feature branch
2. Make your changes
3. Create a changeset:
```bash
pnpm changeset
```
4. Follow the prompts to describe your changes
5. Commit the changeset file
6. Push and create a pull request

### Release Process

Releases are automated via GitHub Actions. When changesets are merged to main, a release PR will be created automatically.

## License

MIT 