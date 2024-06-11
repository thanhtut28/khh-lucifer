"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useForm } from "../hooks/use-form";
import { capitalizeWord } from "../utils/capitalize-word";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

type FormField = { email?: string; password?: string };

export default function RegisterForm() {
  const [values, handleChange] = useForm({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const router = useRouter();

  const loginUser = api.user.register.useMutation({
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
    loginUser.mutate(values);
  };

  useEffect(() => {
    const fields = loginUser.error?.data?.zodError?.fieldErrors;

    const fieldsArr =
      Object.entries(fields ?? {}).map(([k, v]) => ({ [k]: v?.[0] })) ?? [];

    const flatFields: unknown = Object.assign({}, ...fieldsArr);

    if (fields) {
      setError((error) => ({
        ...error,
        ...(flatFields as FormField),
      }));
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
          <form className="space-y-6" action="#" onSubmit={handleSubmit}>
            {Object.keys(values).map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium leading-6 "
                >
                  {capitalizeWord(field)}
                </label>
                <div className="mt-2">
                  <input
                    id={field}
                    name={field}
                    type={field}
                    required
                    value={values[field as "email" | "password"]}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {error[field as "email" | "password"] !== "" && (
                  <div className="py-1">
                    <p className="text-bold text-red-600">
                      {error[field as "email" | "password"]}
                    </p>
                  </div>
                )}
              </div>
            ))}

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
            Already have an account?{" "}
            <button
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              onClick={() => router.push("/login")}
            >
              Go to Login Page.
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
