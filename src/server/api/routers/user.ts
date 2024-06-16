import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { signIn } from "~/server/auth";
import { sendEmail } from "~/server/utils/send-email";

export const userRouter = createTRPCRouter({
  sendOtp: publicProcedure
    .input(
      z.object({
        email: z
          .string({ required_error: "Email is required" })
          .email("Invalid Email"),
      }),
    )
    .mutation(async ({ input: { email }, ctx }): Promise<boolean> => {
      const code = generateRandomString(6, alphabet("0-9", "A-Z"));

      try {
        await ctx.db.otp.create({
          data: {
            code,
            email,
            expiresAt: createDate(new TimeSpan(1, "m")),
          },
        });

        await sendEmail(email, code);
        return true;
      } catch (e) {
        throw e;
      }
    }),

  //! this procedure is not used currently
  verifyEmail: publicProcedure
    .input(
      z.object({
        email: z
          .string({ required_error: "Email is required" })
          .email("Invalid Email"),
        otp: z
          .string({ required_error: "Otp is required" })
          .min(1, "Otp is required")
          .length(6, "OTP length must be 6"),
      }),
    )
    .mutation(async ({ input }): Promise<boolean> => {
      if (!input.email) {
        return false;
      }

      await signIn("credentials", {
        ...input,
        redirect: false,
      });

      return true;
    }),

  //* mutation to test context session
  updateEmail: protectedProcedure
    .input(
      z.object({
        email: z
          .string({ required_error: "Email is required" })
          .email("Invalid Email"),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<boolean> => {
      if (!ctx.session.user) {
        throw new Error("Not Authroized");
      }

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { email: input.email },
      });

      return true;
    }),

  //* query to test protected query
  getSecretMessage: protectedProcedure.query(({ ctx }) => {
    return `Your id is ${ctx.session?.user.id}`;
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
