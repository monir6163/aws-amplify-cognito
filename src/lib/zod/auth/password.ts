import { z } from "zod";

const passwordSchema = z
  .object({
    current_password: z.string().nonempty("Current password is required"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .nonempty("Confirm password is required")
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordSchema = z.infer<typeof passwordSchema>;

const formDefaultValues: PasswordSchema = {
  current_password: "",
  password: "",
  confirmPassword: "",
} as PasswordSchema;

export { formDefaultValues, passwordSchema, type PasswordSchema };
