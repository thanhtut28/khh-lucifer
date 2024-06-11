/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { type NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import signInSchema from "~/validator/signInSchema";
import bcrypt from "bcrypt-ts";
import { ZodError } from "zod";
import { db } from "./db";
import { User } from "@prisma/client";

export default {
  providers: [
    // Resend({
    //   apiKey: process.env.RESEND_API_KEY,
    //   from: "Kaung Hein Htet <lucifer@goldsilvercentral.xyz>",
    //   sendVerificationRequest({
    //     identifier: email,
    //     url,
    //     provider: { server, from },
    //   }) {
    //     // your function
    //     console.log("email sent", email, url, server, from);
    //   },
    // }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } =
            await signInSchema.parseAsync(credentials);

          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("User not found.");
          }

          // logic to salt and hash password
          const isSamePassword = await bcrypt.compare(password, user.password);

          // logic to verify if user exists
          // eslint-disable-next-line @typescript-eslint/no-explicit-any

          // return json object with the user data
          if (!isSamePassword) {
            throw new Error("Incorrect Password");
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
          return user as any;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
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
