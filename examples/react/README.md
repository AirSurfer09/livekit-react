# @convai/web-handsfree Example

This example demonstrates how to use the `@convai/web-handsfree` package to integrate Convai's AI-powered voice assistants into a React application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update the configuration in `src/App.tsx`:
```typescript
await convaiClient.connect({
  apiKey: "your-convai-api-key",
  characterId: "your-character-id",
  enableVideo: true,
  enableAudio: true,
  llmProvider: "gemini-baml",
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

## Features

### Message Sending

```typescript
// Send text message
convaiClient.sendUserTextMessage("Hello! How are you today?");

// Send trigger message
convaiClient.sendTriggerMessage("character_introduction", "User just entered the room");

// Update template keys
convaiClient.updateTemplateKeys({
  user_name: "John",
  location: "New York",
  mood: "excited"
});

// Update dynamic info
convaiClient.updateDynamicInfo({
  text: "The user is now in a virtual museum"
});
```

### Components

- **ChatBot**: Complete chat interface with message history
- **FloatingVideoDisplay**: Local camera feed with mirroring support

### Message Types

- Bot LLM Text: AI character responses
- User Transcription: Speech-to-text results
- Bot Emotion: Character emotional states
- Action Response: Character actions
- Behavior Tree Response: Narrative flow
- Moderation Response: Content moderation

## Demo Controls

When connected, use the demo buttons to test:
- Send Text Message
- Send Trigger
- Update Template Keys
- Update Dynamic Info
- Video Controls (mirror, show/hide)

## Get Convai Credentials

1. Visit [convai.com](https://convai.com) and create an account
2. Navigate to your dashboard
3. Create a new character or use an existing one
4. Copy your API key and character ID 