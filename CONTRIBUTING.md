# Contributing to expo-apple-intelligence

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## 🐛 Bug Reports

If you find a bug, please open an issue with:

1. **Description** - Clear description of the bug
2. **Reproduction steps** - How to reproduce the issue
3. **Expected behavior** - What you expected to happen
4. **Environment** - iOS version, device type, Expo SDK version

## 💡 Feature Requests

Feature requests are welcome! Please open an issue describing:

1. The problem you're trying to solve
2. Your proposed solution
3. Any alternatives you've considered

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- macOS with Xcode 26+
- iOS 26 simulator or device

### Setup

```bash
# Clone the repo
git clone https://github.com/eitjuh/expo-apple-intelligence.git
cd expo-apple-intelligence

# Install dependencies
npm install

# Build the TypeScript
npm run build
```

### Testing Changes

1. Make your changes
2. Build: `npm run build`
3. Test in the example app (if available) or link to a test project

## 📝 Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run linting: `npm run lint`
5. Commit with a clear message
6. Push to your fork
7. Open a Pull Request

### Commit Messages

Follow conventional commits:

- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `chore: update dependencies`

## 📋 Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Keep functions focused and small

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

