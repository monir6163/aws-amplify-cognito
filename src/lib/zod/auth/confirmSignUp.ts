import { z } from "zod";

const confirmSignUpSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  confirmationCode: z.string().nonempty("Confirmation code is required"),
});

type ConfirmSignUpSchema = z.infer<typeof confirmSignUpSchema>;
const formDefaultValues: ConfirmSignUpSchema = {
  email: "",
  confirmationCode: "",
};

export { confirmSignUpSchema, formDefaultValues, type ConfirmSignUpSchema };
