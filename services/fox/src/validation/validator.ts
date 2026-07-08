import type {
  ValidationResult
} from "./types.js";


export function validateCapabilityResult(
  result: unknown
): ValidationResult {


  if (!result) {

    return {

      valid: false,

      reason:
        "Empty capability result"

    };

  }


  return {

    valid: true

  };

}
