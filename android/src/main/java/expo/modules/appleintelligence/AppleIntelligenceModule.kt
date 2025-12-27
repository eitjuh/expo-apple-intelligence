package expo.modules.appleintelligence

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

/**
 * Android stub for Apple Intelligence module.
 * Apple Intelligence is only available on iOS devices, so this module
 * returns unavailable status on Android.
 */
class AppleIntelligenceModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AppleIntelligence")

    AsyncFunction("isAvailable") { 
      false
    }

    AsyncFunction("getAvailabilityStatus") {
      mapOf(
        "status" to "unsupported",
        "isAvailable" to false,
        "message" to "Apple Intelligence is only available on iOS devices"
      )
    }

    AsyncFunction("generateResponse") { _: String ->
      mapOf(
        "success" to false,
        "error" to "Apple Intelligence is only available on iOS devices"
      )
    }

    AsyncFunction("createSession") { _: String? ->
      throw Exception("Apple Intelligence is only available on iOS devices")
    }

    AsyncFunction("sendSessionMessage") { _: String, _: String ->
      mapOf(
        "success" to false,
        "error" to "Apple Intelligence is only available on iOS devices"
      )
    }

    AsyncFunction("resetSession") { _: String ->
      // No-op on Android
    }
  }
}

