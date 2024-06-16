"use server";

import { api } from "~/trpc/server";

export async function verifyEmailAction(email: string, otp: string) {
  return api.user.verifyEmail({ email, otp });
}
