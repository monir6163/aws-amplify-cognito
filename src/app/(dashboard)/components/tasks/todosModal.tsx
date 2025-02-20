import ButtonLoader from "@/components/button-loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTodo, updateTodo } from "@/lib/actions/todos";
import {
  formDefaultValues,
  TodoSchema,
  todoSchema,
} from "@/lib/zod/todos/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
interface DialogDemoProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTodo: any;
}

export function DialogDemo({ open, setOpen, selectedTodo }: DialogDemoProps) {
  const isEditing = !!selectedTodo;
  const form = useForm<TodoSchema>({
    mode: "all",
    resolver: zodResolver(todoSchema),
    defaultValues: formDefaultValues,
  });
  useEffect(() => {
    if (selectedTodo) {
      form.reset({
        title: selectedTodo?.title,
        description: selectedTodo?.description,
        status: selectedTodo?.status,
      });
    } else {
      form.reset(formDefaultValues);
    }
  }, [selectedTodo, form]);
  async function onSubmit(values: TodoSchema) {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("status", values.status);
      if (isEditing) {
        const data = await updateTodo(formData, selectedTodo?.id);
        if (data?.id) {
          toast.success("Todo updated successfully");
          setOpen(false);
          form.reset(formDefaultValues);
        }
      } else {
        const data = await createTodo(formData);
        if (data?.id) {
          toast.success("Todo created successfully");
          setOpen(false);
          form.reset(formDefaultValues);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Todo" : "Create Todo"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modify your todo details here. Click save when done."
              : "Add a new todo. Click save when done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g: Todo title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g: Todo description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting}
              className="w-full inline-flex items-center"
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <ButtonLoader />
              ) : (
                <>{isEditing ? "Save changes" : "Create Todo"}</>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
