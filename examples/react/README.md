# React Example

This is a React example demonstrating the usage of the airsurfer-livekit-react package with full Convai integration.

## Features

- **Connection Management**: Connect to Convai Core Service API
- **RTVI Triggers**: Send trigger messages and commands
- **Transcription Display**: Real-time chat transcriptions
- **LiveKit Integration**: Full LiveKit room context support
- **TypeScript Support**: Complete type safety

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Usage

1. **Start the development server**: `pnpm dev`
2. **Open the application**: Navigate to `http://localhost:3000`
3. **Connect to Convai**: Click the "Connect to Convai" button
4. **Use RTVI Triggers**: Send trigger messages using the trigger controls
5. **View Transcriptions**: See real-time chat transcriptions

## Configuration

The example uses the following Convai configuration:

```typescript
{
  token: 'cdfb24c99142cdc8ecf9003498d14ca6',
  character_id: '700e3450-3242-11f0-a5ce-42010a7be01f',
  transport: 'livekit',
  connection_type: 'audio',
  llm_provider: 'gemini'
}
```

## Architecture

- **RoomContext**: Provides LiveKit room context to all components
- **useConvaiClient**: Manages connection state and room instance
- **TranscriptionView**: Displays real-time chat transcriptions
- **RTVITriggerControls**: UI for sending RTVI trigger messages

## Troubleshooting

If you encounter the "No room provided" error, ensure that:
1. The connection is successful
2. The room is properly initialized
3. Components are wrapped in RoomContext.Provider 