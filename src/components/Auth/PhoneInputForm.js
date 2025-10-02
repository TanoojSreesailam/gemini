"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";
// Import BOTH schemas for conditional validation
import { phoneNumberSchema, otpSchema } from "../../utils/validation";
import PhoneInput from "./PhoneInput";
import OTPForm from "./OTPForm";

const PhoneInputForm = () => {
  const [step, setStep] = useState("phone"); // 'phone' or 'otp'
  const setAuthState = useAppStore((state) => state.setAuthState);

  // Determine which schema to use based on the current step
  const currentSchema = step === "phone" ? phoneNumberSchema : otpSchema;

  const methods = useForm({
    // Pass the correct, valid Zod schema for the current step
    resolver: zodResolver(currentSchema),
    defaultValues: {
      phoneNumber: "",
      fullPhoneNumber: "",
      otp: "",
    },
    mode: "onBlur",
  });
  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const handleSendOTP = (data) => {
    const { fullPhoneNumber } = data;

    const toastId = toast.loading(`Sending OTP to ${fullPhoneNumber}...`);

    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success(`OTP sent! Check console (Hint: 123456).`, {
          id: toastId,
        });
        console.log(
          `--- OTP Simulation --- \nSending Code 123456 to: ${fullPhoneNumber}`
        );
        setStep("otp"); // Move to the OTP verification step
        resolve();
      }, 3000); // 3-second delay
    });
  };

  const handleSuccessfulVerification = () => {
    // 1. Update the global state
    setAuthState({
      isLoggedIn: true,
      user: { phone: getValues("fullPhoneNumber"), name: "User" },
    });
  };

  if (step === "otp") {
    // OTP Form Step
    return (
      <FormProvider {...methods}>
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
          <p className="text-center mb-6 dark:text-gray-400">
            A code has been sent to **{getValues("fullPhoneNumber")}**.
          </p>
          <OTPForm onVerify={handleSuccessfulVerification} />
          <button
            onClick={() => {
              setStep("phone");
              methods.reset(); // Reset form state when changing back to phone
            }}
            className="w-full mt-4 text-sm text-blue-500 hover:underline"
          >
            Change number
          </button>
        </div>
      </FormProvider>
    );
  }

  // Phone Input Step
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleSendOTP)}
        className="max-w-md mx-auto p-8 bg-white dark:bg-gray-900 shadow-xl rounded-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Sign In or Sign Up</h2>
        <p className="text-center dark:text-gray-400">
          Enter your phone number to continue.
        </p>
        <PhoneInput />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
        >
          {isSubmitting ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </FormProvider>
  );
};

export default PhoneInputForm;
