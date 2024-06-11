import Link from "next/link";

import { api } from "~/trpc/server";
import LoginForm from "./_components/login-form";

export default async function Home() {
  return (
    <>
      {/* <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
      </h1> */}

      {/* <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
        </div>

        <CrudShowcase /> */}
      <LoginForm />
    </>
  );
}
