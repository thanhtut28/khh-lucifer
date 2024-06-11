import { db } from "~/server/db";
import { api } from "~/trpc/react";

export async function POST(request: Request) {
  const res: { email: string; password: string } = (await request.json()) as {
    email: string;
    password: string;
  };

  // const user = await db.user.create({
  //   data: {
  //     email: res.email,
  //     password: res.password,
  //   },
  // });

  // await fetch("api/send", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     email: res.email,
  //   }),
  // });

  return Response.json("hello");
}
