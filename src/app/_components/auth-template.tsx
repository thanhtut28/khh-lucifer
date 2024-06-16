"use client";

import { useState } from "react";
import LoginForm from "../_components/login-form";
import { api } from "~/trpc/react";
import OtpForm from "../_components/otp-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { verifyEmailAction } from "../actions/verify-email";
import { sign } from "crypto";

const AuthTemplate: React.FC = () => {
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const sendOtp = api.user.sendOtp.useMutation({
    onSuccess: async () => {
      console.log("otp sent successfully");
      setIsOtpSent(true);
    },
    onError: () => {
      console.log("mutation error", sendOtp?.error?.data);
    },
  });

  const handleSendOtp = (email: string) => {
    sendOtp.mutate({ email });
  };

  const handleVerifyEmail = async (otp: string) => {
    const result = await signIn("credentials", { email, otp, redirect: false });

    console.log("result", result);
    if (!result?.error) {
      router.push("/");
    }

    if (result?.error === "Configuration") {
      setError(true);
    }
  };

  return (
    <>
      {!isOtpSent ? (
        <LoginForm
          loading={sendOtp.status === "pending"}
          sendOtp={handleSendOtp}
          email={email}
          setEmail={setEmail}
        />
      ) : (
        <OtpForm verifyEmail={handleVerifyEmail} />
      )}
    </>
  );
};

export default AuthTemplate;
