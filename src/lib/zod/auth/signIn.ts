import { z } from "zod";

const signInSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type SignInSchema = z.infer<typeof signInSchema>;

const formDefaultValues: SignInSchema = {
  email: "",
  password: "",
};

export { formDefaultValues, signInSchema, type SignInSchema };
