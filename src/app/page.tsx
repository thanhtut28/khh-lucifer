import { auth } from "~/server/auth";
import AuthShowcase from "./_components/auth-showcase";

export default async function Home() {
  // const session = await auth();

  // console.log("session:", session);

  return (
    <>
      <AuthShowcase />
    </>
  );
}
