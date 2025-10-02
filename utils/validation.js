// src/utils/validation.js
import { z } from "zod";

// --- Phone Number Schema ---
// Note: We validate the raw phoneNumber input field (e.g., '1234567890')
// and rely on the UI to handle the dial code (+1).

export const phoneNumberSchema = z.object({
  // The 'phoneNumber' field from the input, excluding the dial code
  phoneNumber: z
    .string()
    .min(6, { message: "Phone number must be at least 6 digits long." })
    .max(15, { message: "Phone number cannot exceed 15 digits." })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only digits." }),

  // The 'fullPhoneNumber' field combines the dial code and number
  // This is primarily for a more realistic submission structure, but
  // the validation focus remains on the 'phoneNumber' structure itself.
  fullPhoneNumber: z.string(),
});

// --- OTP Verification Schema ---

export const otpSchema = z.object({
  // The One-Time Password field
  otp: z
    .string()
    .length(6, { message: "The OTP must be exactly 6 digits." })
    .regex(/^[0-9]+$/, { message: "OTP must contain only digits." }),
});

// We can also create a helper function to validate against a schema
export const validateData = (schema, data) => {
  try {
    schema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format errors for easy use with react-hook-form
      const formattedErrors = error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {});
      return { success: false, errors: formattedErrors };
    }
    return {
      success: false,
      errors: { general: "An unexpected validation error occurred." },
    };
  }
};
