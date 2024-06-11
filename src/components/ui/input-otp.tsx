"use client";

import React, { useState, useRef, useEffect } from "react";
import { api } from "~/trpc/react";

const OtpInput: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpCode, setOtpCode] = useState("");
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const submitOtp = api.user.verifyEmail.useMutation({
    onSuccess: () => {
      console.log("otp correct, you are authenticated");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpCode(newOtp.join(""));

      // Move to the next input field if a number was entered
      if (value && index < otp.length - 1) {
        inputsRef.current[index + 1].focus();
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
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    submitOtp.mutate({ otpCode });
  };

  useEffect(() => {
    // Initialize the first input field to be focused on mount
    inputsRef.current[0].focus();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-2">
        {otp.map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputsRef.current[index] = el!)}
            className="h-14 w-14 rounded border border-gray-300 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      <button
        ref={submitButtonRef}
        onClick={handleSubmit}
        className="w-full rounded bg-blue-500 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
      {submitOtp.error && (
        <p className="text-bold w-full bg-red-100 p-3 text-center text-red-700">
          {submitOtp.error.message}
        </p>
      )}
      {submitOtp.isSuccess && (
        <p className="text-bold w-full bg-green-100 p-3 text-center text-green-700">
          Login Success
        </p>
      )}
    </div>
  );
};

export default OtpInput;
