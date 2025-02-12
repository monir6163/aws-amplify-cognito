import { z } from "zod";

const emailUpdateSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
});

type EmailUpdateSchema = z.infer<typeof emailUpdateSchema>;
const formDefaultValues: EmailUpdateSchema = {
  email: "",
};
export { emailUpdateSchema, formDefaultValues, type EmailUpdateSchema };
