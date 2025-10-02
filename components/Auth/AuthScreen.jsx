
import { useState } from "react";
import { useCountryCodes } from "@/hooks/useCountryCodes";
import { useAppStore } from "@/store/useAppStore";

const AuthScreen = () => {
  const [step, setStep] = useState(1); // 1 for login, 2 for OTP
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const { countryCodes } = useCountryCodes();
  const { login } = useAppStore();

  const handleLogin = () => {
    // Simulate sending OTP
    console.log(`Sending OTP to ${phoneNumber}`);
    setStep(2);
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification
    console.log(`Verifying OTP ${otp}`);
    login();
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    // In a real app, you'd send an OTP to the phoneNumber
    handleLogin();
  };

  const handleResendOtp = () => {
    // In a real app, you'd resend the OTP
    console.log("Resending OTP");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleNext = (e) => {
    e.preventDefault();
    handleVerifyOtp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <div className="flex">
                <select className="border border-gray-300 rounded-l-md p-2">
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.dial_code}>
                      {country.dial_code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  id="phone"
                  className="border border-gray-300 rounded-r-md p-2 w-full"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleNext}>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Enter OTP
            </h2>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={otp}
                onChange={handleOtpChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Verify
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-blue-500"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
