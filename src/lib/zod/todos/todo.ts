import { z } from "zod";

const todoSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  status: z.enum(["pending", "completed"]).default("pending"),
});

type TodoSchema = z.infer<typeof todoSchema>;

const formDefaultValues: TodoSchema = {
  title: "",
  description: "",
  status: "pending",
};

export { formDefaultValues, todoSchema, type TodoSchema };
