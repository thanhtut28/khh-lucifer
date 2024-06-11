"use client";

import { useEffect, useState, type FormEvent } from "react";
import { capitalizeWord } from "../utils/capitalize-word";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { signIn } from "~/server/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const loginUser = api.user.login.useMutation({
    onSuccess: async () => {
      console.log("mutation success");
      router.push("/verify-email");
    },
    onError: () => {
      console.log("mutation error", loginUser?.error?.data);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser.mutate({ email, password });
  };

  useEffect(() => {
    const fields = loginUser.error?.data?.zodError?.fieldErrors;

    const fieldsArr =
      Object.entries(fields ?? {}).map(([k, v]) => ({ [k]: v?.[0] })) ?? [];

    const flatFields: unknown = Object.assign({}, ...fieldsArr);

    if (fields) {
      // setError(flatFields?.email);
      console.log(flatFields);
    }
  }, [loginUser.error?.data]);

  console.log();

  return (
    <>
      <div className="flex min-h-full w-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="py-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-5xl font-bold leading-9 tracking-tight">
            Midas
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor={"email"}
                className="block text-sm font-medium leading-6 "
              >
                {capitalizeWord("email")}
              </label>
              <div className="mt-2">
                <input
                  id={"email"}
                  name={`email`}
                  type={`email`}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error !== "" && (
                <div className="py-1">
                  <p className="text-bold text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor={"password"}
                className="block text-sm font-medium leading-6 "
              >
                {capitalizeWord("password")}
              </label>
              <div className="mt-2">
                <input
                  id={"password"}
                  name={`password`}
                  type={`password`}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error !== "" && (
                <div className="py-1">
                  <p className="text-bold text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <div>{}</div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not registered yet?{" "}
            <button
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              onClick={() => router.push("/register")}
            >
              Create a new account.
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
