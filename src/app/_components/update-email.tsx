"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { capitalizeWord } from "../utils/capitalize-word";

const UpdateEmailForm: React.FC = () => {
  const [email, setEmail] = useState("");

  const updateEmail = api.user.updateEmail.useMutation({
    onSuccess: () => {
      console.log("email updated");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmail.mutate({ email });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={"email"}
          className="block text-sm font-medium leading-6 "
        >
          {capitalizeWord("new email")}
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
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default UpdateEmailForm;
