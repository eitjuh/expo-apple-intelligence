import { NativeModule, requireNativeModule } from 'expo-modules-core';

import type { AvailabilityStatus, GenerateResponseResult } from './AppleIntelligence';

declare class AppleIntelligenceModuleType extends NativeModule {
  isAvailable(): Promise<boolean>;
  getAvailabilityStatus(): Promise<AvailabilityStatus>;
  generateResponse(prompt: string): Promise<GenerateResponseResult>;
  createSession(systemPrompt?: string): Promise<string>;
  sendSessionMessage(sessionId: string, message: string): Promise<GenerateResponseResult>;
  resetSession(sessionId: string): Promise<void>;
}

// This call throws if the native module is not available
// We handle this gracefully in AppleIntelligence.ts
export const AppleIntelligenceModule =
  requireNativeModule<AppleIntelligenceModuleType>('AppleIntelligence');

export default AppleIntelligenceModule;

