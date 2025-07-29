# Convai React Example

This example demonstrates how to use the `airsurfer-livekit-react` package to integrate Convai's AI-powered voice assistants into a React application.

## Features Demonstrated

### 1. Basic Connection
- Connect to Convai with API key and character ID
- Real-time audio/video communication
- Connection state management

### 2. Message Sending Functions

#### User Text Messages
```typescript
// Send a text message to the AI character
convaiClient.sendUserTextMessage("Hello! How are you today?");
```

#### Trigger Messages
```typescript
// Send a trigger to activate narrative events
convaiClient.sendTriggerMessage("character_introduction", "User just entered the room");
```

#### Template Keys Updates
```typescript
// Update dynamic template variables for character responses
convaiClient.updateTemplateKeys({
  user_name: "John",
  location: "New York",
  mood: "excited",
  time_of_day: "morning"
});
```

#### Dynamic Info Updates
```typescript
// Provide contextual information that influences character behavior
convaiClient.updateDynamicInfo({
  text: "The user is now in a virtual museum looking at ancient artifacts"
});
```

### 3. Message Types Handled

The example automatically handles various incoming message types:

- **Bot LLM Text**: AI character responses
- **User Transcription**: Speech-to-text results
- **Bot Emotion**: Character emotional states
- **Action Response**: Character actions and animations
- **Behavior Tree Response**: Narrative flow information
- **Moderation Response**: Content moderation results

## Demo Controls

When connected, the example provides demo buttons to test each message type:

1. **Send Text Message**: Sends a user text message
2. **Send Trigger**: Activates a narrative trigger
3. **Update Template Keys**: Updates character template variables
4. **Update Dynamic Info**: Provides contextual information

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update the configuration in `src/App.tsx`:
```typescript
await convaiClient.connect({
  apiKey: "your-api-key-here",
  characterId: "your-character-id-here",
  enableVideo: true,
  enableAudio: true,
  llmProvider: "gemini-baml",
  // Optional: Add action configuration
  actionConfig: {
    actions: ["Wave", "Smile", "Point"],
    characters: [
      { name: "Character", bio: "Character description" },
      { name: "Player", bio: "" }
    ],
    objects: [
      { name: "Object", description: "Object description" }
    ]
  }
});
```

3. Run the development server:
```bash
npm run dev
```

## Usage Patterns

### Basic Chat Interface
The `ChatBot` component provides a complete chat interface that:
- Displays all message types with appropriate styling
- Handles user input and sends messages
- Shows connection status and activity
- Auto-scrolls to new messages

### Video Display
The `FloatingVideoDisplay` component shows:
- Local camera feed
- Connection status
- Expandable/collapsible interface

### Programmatic Message Sending
You can send messages programmatically from anywhere in your app:

```typescript
// Send a greeting when user connects
useEffect(() => {
  if (convaiClient.state.isConnected) {
    convaiClient.sendUserTextMessage("Hello! I'm ready to chat.");
  }
}, [convaiClient.state.isConnected]);

// Update context when user changes location
const handleLocationChange = (newLocation: string) => {
  convaiClient.updateDynamicInfo({
    text: `The user is now in ${newLocation}`
  });
};
```

## Message Format Examples

### User Text Message
```json
{
  "type": "user_text_message",
  "data": {
    "text": "Hello, how are you?"
  }
}
```

### Trigger Message
```json
{
  "type": "trigger-message",
  "data": {
    "trigger_name": "character_introduction",
    "trigger_message": "The user just entered the room"
  }
}
```

### Template Keys Update
```json
{
  "type": "update-template-keys",
  "data": {
    "template_keys": {
      "user_name": "John",
      "location": "New York",
      "mood": "excited"
    }
  }
}
```

### Dynamic Info Update
```json
{
  "type": "update-dynamic-info",
  "data": {
    "dynamic_info": {
      "text": "The user is now in a virtual museum"
    }
  }
}
```

## Error Handling

The example includes comprehensive error handling:
- Connection errors are displayed to the user
- Message sending errors are logged to console
- Graceful fallbacks for failed operations

## Styling

The example uses Tailwind CSS with:
- Glass morphism effects
- Gradient backgrounds
- Smooth animations with Framer Motion
- Responsive design
- Dark theme optimized for video content

## Next Steps

1. Replace the API key and character ID with your own
2. Customize the action configuration for your use case
3. Add your own UI components and styling
4. Implement additional message handling logic
5. Add error recovery and reconnection logic 