# expo-apple-intelligence

<p align="center">
  <img src="https://img.shields.io/npm/v/expo-apple-intelligence?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/expo-apple-intelligence?style=flat-square" alt="npm downloads" />
  <img src="https://img.shields.io/badge/platforms-iOS-lightgrey?style=flat-square" alt="platforms" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" />
</p>

<p align="center">
  <b>Access Apple's on-device Foundation Models (Apple Intelligence) from React Native/Expo.</b>
  <br />
  <i>Private. Fast. Offline.</i>
</p>

---

## ✨ Features

- 🔒 **Complete Privacy** - All AI processing happens on-device. Your data never leaves the phone.
- ⚡ **Blazing Fast** - Powered by Apple Neural Engine for instant responses.
- 📴 **Works Offline** - No internet connection required.
- 💬 **Session Support** - Maintain conversation context across messages.
- 🎯 **Simple API** - Just a few functions to get started.

## 📋 Requirements

| Requirement | Minimum |
|-------------|---------|
| iOS Version | iOS 26.0+ |
| Device | iPhone 15 Pro+ / iPad with M1+ |
| Apple Intelligence | Must be enabled in Settings |
| Xcode | 26.0+ |

> ⚠️ **Beta Notice**: iOS 26 and the Foundation Models framework are currently in beta. APIs may change.

## 🚀 Installation

```bash
npx expo install expo-apple-intelligence
```

### Development Build Required

This package requires native code, so you'll need a [development build](https://docs.expo.dev/develop/development-builds/introduction/):

```bash
# Install expo-dev-client if you haven't already
npx expo install expo-dev-client

# Build for iOS
npx expo run:ios
```

## 📖 Quick Start

```typescript
import * as AppleIntelligence from 'expo-apple-intelligence';

// Check if Apple Intelligence is available
const available = await AppleIntelligence.isAvailable();

if (available) {
  // Generate a response
  const result = await AppleIntelligence.generateResponse(
    'Explain quantum computing in simple terms'
  );
  
  if (result.success) {
    console.log(result.response);
  }
}
```

## 📚 API Reference

### `isAvailable()`

Check if Apple Intelligence is available on the current device.

```typescript
const available: boolean = await AppleIntelligence.isAvailable();
```

### `getAvailabilityStatus()`

Get detailed availability information including reasons for unavailability.

```typescript
const status = await AppleIntelligence.getAvailabilityStatus();

// status: {
//   status: 'available' | 'unavailable' | 'unsupported' | 'unknown';
//   isAvailable: boolean;
//   reason?: string;
//   message: string;
// }
```

**Possible statuses:**
- `available` - Apple Intelligence is ready to use
- `unavailable` - Device supports it but it's not enabled/ready
- `unsupported` - Device or iOS version doesn't support Apple Intelligence
- `unknown` - Unable to determine status

### `generateResponse(prompt)`

Generate a response using Apple's on-device language model.

```typescript
const result = await AppleIntelligence.generateResponse('Your prompt here');

// result: {
//   success: boolean;
//   response?: string;  // The generated text
//   error?: string;     // Error message if failed
// }
```

### `createSession(options?)`

Create a conversation session that maintains context across messages.

```typescript
const session = await AppleIntelligence.createSession({
  systemPrompt: 'You are a helpful coding assistant.' // Optional
});

// Send messages that build on each other
const response1 = await session.sendMessage('What is TypeScript?');
const response2 = await session.sendMessage('How do I use interfaces?');
// The model remembers the context from previous messages

// Reset the conversation
await session.reset();
```

## 💡 Examples

### Basic Chat

```typescript
import { useState } from 'react';
import * as AppleIntelligence from 'expo-apple-intelligence';

function ChatScreen() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend(message: string) {
    setLoading(true);
    
    const result = await AppleIntelligence.generateResponse(message);
    
    if (result.success) {
      setResponse(result.response ?? '');
    } else {
      console.error(result.error);
    }
    
    setLoading(false);
  }

  return (/* your UI */);
}
```

### Checking Availability

```typescript
import { useEffect, useState } from 'react';
import * as AppleIntelligence from 'expo-apple-intelligence';

function App() {
  const [status, setStatus] = useState<string>('Checking...');

  useEffect(() => {
    async function checkAvailability() {
      const result = await AppleIntelligence.getAvailabilityStatus();
      setStatus(result.message);
    }
    checkAvailability();
  }, []);

  return (/* show status */);
}
```

### Persistent Conversation

```typescript
import * as AppleIntelligence from 'expo-apple-intelligence';

// Create a session once
const session = await AppleIntelligence.createSession({
  systemPrompt: 'You are a friendly assistant who speaks casually.'
});

// Send multiple messages - context is preserved
await session.sendMessage('Hi! My name is Alex.');
await session.sendMessage('What did I just tell you my name was?');
// The model will remember "Alex"
```

## ❓ FAQ

### Why does it show "unavailable" on my device?

Apple Intelligence requires:
1. **iOS 26 or later** - Currently in beta
2. **Supported hardware** - iPhone 15 Pro/Pro Max or later, iPad with M1 chip or later
3. **Apple Intelligence enabled** - Go to Settings → Apple Intelligence & Siri → Turn on Apple Intelligence
4. **Model downloaded** - The on-device model may need to download first

### Does this work on Android?

No. Apple Intelligence is an Apple-only feature. On Android, `isAvailable()` will return `false` and all generation functions will return an error indicating the platform is unsupported.

### Is my data sent to Apple's servers?

No. All processing happens entirely on your device using Apple's Neural Engine. This is one of the key privacy benefits of Apple Intelligence.

### Can I use this with Expo Go?

No. This package requires native code, so you need to use a [development build](https://docs.expo.dev/develop/development-builds/introduction/) or a standalone app.

## 🔧 Troubleshooting

### "Native module not loaded"

Make sure you've created a development build:

```bash
npx expo run:ios
```

### "Foundation Models not available"

Your Xcode or iOS simulator may not be on version 26+. Check your versions:

```bash
xcodebuild -version
```

### Build errors with Swift

Ensure your project is set up for Swift. The module requires Swift 5.9+.

## 📄 License

MIT © [eitjuh](https://github.com/eitjuh)

## 🙏 Acknowledgments

- Apple for the Foundation Models framework
- The Expo team for expo-modules-core

---

<p align="center">
  <sub>Built with ❤️ for the React Native community</sub>
</p>

