import { z } from "zod";

const codeSchema = z.object({
  code: z
    .string()
    .nonempty("Code is required")
    .length(6, "Code must be 6 characters long"),
});

type CodeSchema = z.infer<typeof codeSchema>;
const formDefaultValues: CodeSchema = {
  code: "",
};
export { codeSchema, formDefaultValues, type CodeSchema };
