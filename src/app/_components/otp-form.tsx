"use client";

import React, { useState, useRef, useEffect } from "react";

interface Props {
  verifyEmail: (otpCode: string) => void;
}

const OtpForm: React.FC<Props> = ({ verifyEmail }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpCode, setOtpCode] = useState("");
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.toUpperCase();
      setOtp(newOtp);
      setOtpCode(newOtp.join(""));

      // Move to the next input field if a number was entered
      if (value && index < otp.length - 1) {
        inputsRef?.current[index + 1]?.focus();
      } else if (value && index === otp.length - 1) {
        submitButtonRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    // Initialize the first input field to be focused on mount
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="py-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-xl font-medium leading-9">
          Enter OTP from your Email
        </h2>
      </div>
      <div className="flex space-x-2">
        {otp.map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              inputsRef.current[index] = el!;
            }}
            className="h-14 w-14 rounded border border-gray-300 text-center text-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      <button
        ref={submitButtonRef}
        onClick={() => verifyEmail(otpCode)}
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:pointer-events-none disabled:opacity-40"
      >
        Submit
      </button>
    </div>
  );
};

export default OtpForm;
