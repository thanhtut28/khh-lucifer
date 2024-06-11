import { EmailTemplate } from "~/app/_components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const res: { email: string; password: string } = (await request.json()) as {
    email: string;
    password: string;
  };
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["rday61062@gmail.com"],
      subject: "Hello world",
      react: EmailTemplate({ firstName: res.email }),
      // text field for typesafety
      text: "",
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
