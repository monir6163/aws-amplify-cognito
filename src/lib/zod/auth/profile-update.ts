import { z } from "zod";

const profileUpdateSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must be at most 255 characters"),
  phone_number: z
    .string()
    .nonempty("Phone number required")
    .min(14, "Phone number must be at least 14 characters")
    .max(14, "Phone number must be at most 14 characters"),
});

type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;

const formDefaultValues: ProfileUpdateSchema = {
  name: "",
  phone_number: "",
};

export { formDefaultValues, profileUpdateSchema, type ProfileUpdateSchema };
