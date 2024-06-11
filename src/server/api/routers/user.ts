import { hash } from "bcrypt-ts";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { signIn } from "~/server/auth";
import { sendEmail } from "~/server/utils/send-email";
import signInSchema from "~/validator/signInSchema";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(2) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      const hashedPassword = await hash(input.password, 10);

      return ctx.db.user.create({
        data: {
          ...input,
          password: hashedPassword,
        },
      });
    }),

  login: publicProcedure
    .input(signInSchema)
    .mutation(async ({ input }): Promise<boolean> => {
      if (!input.email) {
        return false;
      }

      await signIn("credentials",  input);

      return true;
    }),

  // login: publicProcedure
  //   .input(z.object({ email: z.string().email(), password: z.string().min(2) }))
  //   .mutation(async ({ ctx, input: { email, password } }): Promise<boolean> => {
  //     const user = await ctx.db.user.findUnique({
  //       where: {
  //         email,
  //       },
  //     });

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     if (password !== user.password) {
  //       throw new Error("Password incorrect");
  //     }

  //     const code = generateRandomString(6, alphabet("0-9", "A-Z"));

  //     const otp = await ctx.db.otp.create({
  //       data: {
  //         code,
  //         expiresAt: createDate(new TimeSpan(1, "m")),
  //         userId: user.id,
  //       },
  //     });

  //     await sendEmail(email, otp.code);

  //     return true;
  //   }),

  // verifyEmail: publicProcedure
  //   .input(z.object({ otpCode: z.string().length(6) }))
  //   .mutation(async ({ ctx, input }): Promise<boolean> => {
  //     const otp = await ctx.db.otp.findFirst({
  //       where: {
  //         code: input.otpCode,
  //       },
  //     });

  //     if (!otp) {
  //       throw new Error("Incorrect Otp");
  //     }

  //     if (!isWithinExpirationDate(new Date(otp.expiresAt))) {
  //       throw new Error("OTP expired");
  //     }

  //     return true;
  //   }),
});
