import { useState } from "react";
import type { ChangeEvent } from "react";

export const useForm = (initialValues: {
  email: string;
  password: string;
}): [
  {
    email: string;
    password: string;
  },
  (e: ChangeEvent<HTMLInputElement>) => void,
] => {
  const [values, setValues] = useState(initialValues);

  return [
    values,
    (e: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [e.target.name]: e.target.value });
    },
  ];
};
