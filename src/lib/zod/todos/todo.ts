import { z } from "zod";

const todoSchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .nonempty("Description is required")
    .min(10, "Description must be at least 10 characters long"),
  status: z.enum(["pending", "completed"]).default("pending"),
});

type TodoSchema = z.infer<typeof todoSchema>;

const formDefaultValues: TodoSchema = {
  title: "",
  description: "",
  status: "pending",
};

export { formDefaultValues, todoSchema, type TodoSchema };
