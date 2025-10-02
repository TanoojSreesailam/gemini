// src/components/auth/OTPForm.js
"use client";

import { useFormContext, Controller } from "react-hook-form";
import toast from "react-hot-toast";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { otpSchema } from "@/utils/validation";

const OTPForm = ({ onVerify }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const handleVerifyOTP = (data) => {
    // 1. Show loading state
    const toastId = toast.loading("Verifying OTP...");

    // 2. Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple success/fail simulation (e.g., OTP '123456' is correct)
        if (data.otp === "123456") {
          toast.success("Login Successful! Welcome.", { id: toastId });
          onVerify(); // Call the parent handler on success
        } else {
          toast.error("Invalid OTP. Please try again.", { id: toastId });
        }
        resolve();
      }, 2000); // 2-second delay
    });
  };

  return (
    <form onSubmit={handleSubmit(handleVerifyOTP)} className="space-y-6">
      <Controller
        name="otp"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="otp"
              className="text-sm font-medium dark:text-gray-300"
            >
              Enter 6-Digit Code
            </label>
            <input
              {...field}
              id="otp"
              type="text"
              maxLength="6"
              placeholder="e.g., 123456"
              className={`w-full py-3 px-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 text-center tracking-[1rem] ${
                errors.otp ? "border-red-500" : ""
              }`}
            />
            {errors.otp && (
              <p className="text-sm text-red-500">{errors.otp.message}</p>
            )}
          </div>
        )}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
      >
        {isSubmitting ? "Verifying..." : "Verify Code"}
      </button>
      <p className="text-center text-sm dark:text-gray-400">
        Hint: Use **123456** to successfully login.
      </p>
    </form>
  );
};

export default OTPForm;
