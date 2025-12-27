import AppleIntelligenceModule from './AppleIntelligenceModule';

/**
 * Availability status of Apple Intelligence on the current device.
 */
export interface AvailabilityStatus {
  /** Current availability status */
  status: 'available' | 'unavailable' | 'unsupported' | 'unknown';
  /** Whether Apple Intelligence can be used */
  isAvailable: boolean;
  /** Reason for unavailability (if applicable) */
  reason?: string;
  /** Human-readable status message */
  message: string;
}

/**
 * Result from generating a response.
 */
export interface GenerateResponseResult {
  /** Whether the generation was successful */
  success: boolean;
  /** The generated response text */
  response?: string;
  /** Error message if generation failed */
  error?: string;
}

/**
 * Options for creating a session.
 */
export interface SessionOptions {
  /** System prompt to set context for the conversation */
  systemPrompt?: string;
}

/**
 * A conversation session with Apple Intelligence.
 */
export interface Session {
  /** Unique session identifier */
  id: string;
  /** Send a message and get a response */
  sendMessage: (message: string) => Promise<GenerateResponseResult>;
  /** Reset the conversation history */
  reset: () => Promise<void>;
}

// Track if module is available
let moduleLoadError: string | null = null;
let isModuleAvailable = false;

try {
  // Check if module exports are available
  isModuleAvailable = typeof AppleIntelligenceModule?.isAvailable === 'function';
} catch (error) {
  moduleLoadError = error instanceof Error ? error.message : 'Unknown error loading native module';
  console.warn('[expo-apple-intelligence] Native module not loaded:', moduleLoadError);
}

/**
 * Check if Apple Intelligence is available on the current device.
 * 
 * @returns Promise that resolves to true if Apple Intelligence is available
 * 
 * @example
 * ```typescript
 * import { isAvailable } from 'expo-apple-intelligence';
 * 
 * const available = await isAvailable();
 * if (available) {
 *   // Apple Intelligence is ready to use
 * }
 * ```
 */
export async function isAvailable(): Promise<boolean> {
  if (!isModuleAvailable) {
    return false;
  }
  try {
    return await AppleIntelligenceModule.isAvailable();
  } catch {
    return false;
  }
}

/**
 * Get detailed availability status including reasons for unavailability.
 * 
 * @returns Promise that resolves to detailed availability information
 * 
 * @example
 * ```typescript
 * import { getAvailabilityStatus } from 'expo-apple-intelligence';
 * 
 * const status = await getAvailabilityStatus();
 * console.log(status.message);
 * // "Apple Intelligence is ready to use"
 * // or "Apple Intelligence is not available: modelNotReady"
 * ```
 */
export async function getAvailabilityStatus(): Promise<AvailabilityStatus> {
  if (!isModuleAvailable) {
    return {
      status: 'unsupported',
      isAvailable: false,
      message: moduleLoadError
        ? `Native module failed to load: ${moduleLoadError}`
        : 'Apple Intelligence is only available on iOS 26+ devices',
    };
  }
  try {
    return await AppleIntelligenceModule.getAvailabilityStatus();
  } catch (error) {
    return {
      status: 'unknown',
      isAvailable: false,
      message: `Error checking availability: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Generate a response using Apple's on-device language model.
 * All processing happens locally on the device - no data is sent to any server.
 * 
 * @param prompt - The input prompt to send to the model
 * @returns Promise that resolves to the generation result
 * 
 * @example
 * ```typescript
 * import { generateResponse } from 'expo-apple-intelligence';
 * 
 * const result = await generateResponse('Explain quantum computing in simple terms');
 * 
 * if (result.success) {
 *   console.log(result.response);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export async function generateResponse(prompt: string): Promise<GenerateResponseResult> {
  if (!isModuleAvailable) {
    return {
      success: false,
      error: 'Apple Intelligence is not available on this device',
    };
  }

  if (!prompt || typeof prompt !== 'string') {
    return {
      success: false,
      error: 'Prompt must be a non-empty string',
    };
  }

  try {
    return await AppleIntelligenceModule.generateResponse(prompt);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error generating response',
    };
  }
}

/**
 * Create a conversation session with Apple Intelligence.
 * Sessions maintain context across multiple messages.
 * 
 * @param options - Optional session configuration
 * @returns Promise that resolves to a Session object
 * 
 * @example
 * ```typescript
 * import { createSession } from 'expo-apple-intelligence';
 * 
 * const session = await createSession({
 *   systemPrompt: 'You are a helpful coding assistant.'
 * });
 * 
 * const response1 = await session.sendMessage('What is TypeScript?');
 * const response2 = await session.sendMessage('How do I use interfaces?');
 * // Session maintains context from previous messages
 * ```
 */
export async function createSession(options?: SessionOptions): Promise<Session> {
  if (!isModuleAvailable) {
    throw new Error('Apple Intelligence is not available on this device');
  }

  try {
    const sessionId = await AppleIntelligenceModule.createSession(options?.systemPrompt);

    return {
      id: sessionId,
      sendMessage: async (message: string) => {
        return AppleIntelligenceModule.sendSessionMessage(sessionId, message);
      },
      reset: async () => {
        return AppleIntelligenceModule.resetSession(sessionId);
      },
    };
  } catch (error) {
    throw new Error(
      `Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

