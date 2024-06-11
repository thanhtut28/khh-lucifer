import { z } from "zod";

export default z.object({
  email: z.string().min(1, "Email is required").email("Invalid Email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(4, "Password must be more than 4 characters"),
});
