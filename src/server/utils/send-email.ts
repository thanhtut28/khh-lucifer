import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email: string, otpCode: string) {
  try {
    const data = await resend.emails.send({
      from: "Midas <midas@goldsilvercentral.xyz>",
      to: email,
      subject: "OTP Verification",
      // text field for typesafety
      text: `Thanks for choosing Midas. Your OTP code is ${otpCode}.`,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
