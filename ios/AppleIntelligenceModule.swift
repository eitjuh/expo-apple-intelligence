import ExpoModulesCore

#if canImport(FoundationModels)
import FoundationModels

/// Session storage wrapper - must be @available since LanguageModelSession is iOS 26+
@available(iOS 26.0, macOS 26.0, *)
private class SessionStore {
  static let shared = SessionStore()
  var sessions: [String: LanguageModelSession] = [:]
}
#endif

/// Expo module providing access to Apple's on-device Foundation Models (Apple Intelligence)
public class AppleIntelligenceModule: Module {
  
  public func definition() -> ModuleDefinition {
    Name("AppleIntelligence")
    
    // MARK: - Availability Functions
    
    /// Check if Apple Intelligence is available on this device
    AsyncFunction("isAvailable") { () -> Bool in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, macOS 26.0, *) {
        let model = SystemLanguageModel.default
        return model.isAvailable
      }
      #endif
      return false
    }
    
    /// Get detailed availability status including reasons for unavailability
    AsyncFunction("getAvailabilityStatus") { () -> [String: Any] in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, macOS 26.0, *) {
        let model = SystemLanguageModel.default
        let availability = model.availability
        
        switch availability {
        case .available:
          return [
            "status": "available",
            "isAvailable": true,
            "message": "Apple Intelligence is ready to use"
          ]
        case .unavailable(let reason):
          let reasonString = String(describing: reason)
          return [
            "status": "unavailable",
            "isAvailable": false,
            "reason": reasonString,
            "message": "Apple Intelligence is not available: \(reasonString)"
          ]
        @unknown default:
          return [
            "status": "unknown",
            "isAvailable": false,
            "message": "Unknown availability status"
          ]
        }
      }
      #endif
      return [
        "status": "unsupported",
        "isAvailable": false,
        "message": "This iOS version does not support Foundation Models (requires iOS 26+)"
      ]
    }
    
    // MARK: - Generation Functions
    
    /// Generate a response from the on-device LLM
    AsyncFunction("generateResponse") { (prompt: String) -> [String: Any] in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, macOS 26.0, *) {
        let model = SystemLanguageModel.default
        
        guard model.isAvailable else {
          return [
            "success": false,
            "error": "Apple Intelligence is not available on this device"
          ]
        }
        
        do {
          let session = LanguageModelSession()
          let response = try await session.respond(to: prompt)
          
          return [
            "success": true,
            "response": response.content
          ]
        } catch {
          return [
            "success": false,
            "error": error.localizedDescription
          ]
        }
      }
      #endif
      return [
        "success": false,
        "error": "Foundation Models framework is not available (requires iOS 26+)"
      ]
    }
    
    // MARK: - Session Management
    
    /// Create a new conversation session with optional system prompt
    AsyncFunction("createSession") { (systemPrompt: String?) -> String in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, macOS 26.0, *) {
        let model = SystemLanguageModel.default
        
        guard model.isAvailable else {
          throw NSError(
            domain: "AppleIntelligence",
            code: 1,
            userInfo: [NSLocalizedDescriptionKey: "Apple Intelligence is not available"]
          )
        }
        
        let sessionId = UUID().uuidString
        let session = LanguageModelSession()
        
        // If a system prompt is provided, send it as the first message to set context
        if let systemPrompt = systemPrompt, !systemPrompt.isEmpty {
          _ = try await session.respond(to: "System: \(systemPrompt)")
        }
        
        SessionStore.shared.sessions[sessionId] = session
        return sessionId
      }
      #endif
      throw NSError(
        domain: "AppleIntelligence",
        code: 2,
        userInfo: [NSLocalizedDescriptionKey: "Foundation Models not available"]
      )
    }
    
    /// Send a message to an existing session
    AsyncFunction("sendSessionMessage") { (sessionId: String, message: String) -> [String: Any] in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, macOS 26.0, *) {
        guard let session = SessionStore.shared.sessions[sessionId] else {
          return [
            "success": false,
            "error": "Session not found. Create a new session first."
          ]
        }
        
        do {
          let response = try await session.respond(to: message)
          return [
            "success": true,
            "response": response.content
          ]
        } catch {
          return [
            "success": false,
            "error": error.localizedDescription
          ]
        }
      }
      #endif
      return [
        "success": false,
        "error": "Foundation Models not available"
      ]
    }
    
    /// Reset a session's conversation history
    AsyncFunction("resetSession") { (sessionId: String) in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, macOS 26.0, *) {
        // Remove the old session and create a new one with the same ID
        if SessionStore.shared.sessions[sessionId] != nil {
          SessionStore.shared.sessions[sessionId] = LanguageModelSession()
        }
      }
      #endif
    }
    
    /// End and remove a session
    AsyncFunction("endSession") { (sessionId: String) in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, macOS 26.0, *) {
        SessionStore.shared.sessions.removeValue(forKey: sessionId)
      }
      #endif
    }
  }
}
