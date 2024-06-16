"use client";

import type { Dispatch, SetStateAction, FormEvent } from "react";
import { capitalizeWord } from "../utils/capitalize-word";

interface Props {
  sendOtp: (email: string) => void;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  loading: boolean;
}

const LoginForm: React.FC<Props> = ({
  sendOtp,
  email,
  setEmail,
  loading = false,
}) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendOtp(email);
  };

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
                  type={`text`}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                disabled={loading}
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:pointer-events-none disabled:opacity-40"
              >
                {!loading ? `Login` : `...`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
