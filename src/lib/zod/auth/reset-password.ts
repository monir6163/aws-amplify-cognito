import { z } from "zod";

const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .nonempty("Confirm password is required")
      .min(8, "Password must be at least 8 characters"),

    confirmationCode: z.string().nonempty("Confirmation code is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

const formDefaultValues: ResetPasswordSchema = {
  email: "",
  password: "",
  confirmPassword: "",
  confirmationCode: "",
};

export { formDefaultValues, resetPasswordSchema, type ResetPasswordSchema };
