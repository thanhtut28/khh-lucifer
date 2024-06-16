/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextAuthConfig } from "next-auth";
import Credentials, {
  type CredentialInput,
  type CredentialsConfig,
} from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import { db } from "./db";
import { Prisma, type User } from "@prisma/client";
import { retriveNameFromEmail } from "~/lib/utils";
import { isWithinExpirationDate } from "oslo";

type Provider =
  | CredentialsConfig<Record<string, CredentialInput>>
  | (() => CredentialsConfig<Record<string, CredentialInput>>);

export const authConfig = {
  providers: [
    Github,
    Credentials({
      name: "OTP",
      credentials: {
        email: { label: "email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      authorize: async (credentials) => {
        const { email, otp } = credentials;

        const otpRecord = await db.otp.findFirst({
          where: {
            code: otp as string,
          },
        });

        if (!otpRecord) {
          throw new Error("Invalid OTP");
        }

        if (!isWithinExpirationDate(otpRecord.expiresAt)) {
          throw new Error("OTP expired");
        }

        await db.otp.delete({
          where: {
            id: otpRecord.id,
          },
        });

        const user = await db.user.findUnique({
          where: { email: email as string },
        });

        if (!user) {
          const newUser = await db.user.create({
            data: { email: email as string },
          });

          return {
            id: newUser.id,
            email: newUser.email,
            name: retriveNameFromEmail(newUser.email),
          } as User;
        }

        return {
          id: user.id,
          email: user.email,
          name: retriveNameFromEmail(user.email),
        } as User;
      },
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
} satisfies NextAuthConfig;
