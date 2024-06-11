import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email: string, otpCode: string) {
  try {
    const data = await resend.emails.send({
      from: "Kaung Hein Htet <lucifer@goldsilvercentral.xyz>",
      to: ["kaungheinhtetutycc@gmail.com"],
      subject: "Verify with OTP",
      // text field for typesafety
      text: `Log in with the otp code provided: ${otpCode}`,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
