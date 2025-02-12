"use client";
import useAuthUser from "@/app/hooks/use-auth-user";
import ButtonLoader from "@/components/button-loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleUpdateUserAttribute } from "@/lib/actions/cognitoActions";
import {
  EmailUpdateSchema,
  emailUpdateSchema,
  formDefaultValues,
} from "@/lib/zod/auth/email-update";

import { getErrorMessage } from "@/utlis/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CodeUpdate from "./code-form";

export default function EmailUpdate() {
  const user = useAuthUser();
  const [code, setCode] = useState<string | null>(null);
  const form = useForm<EmailUpdateSchema>({
    mode: "all",
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    if (user) {
      form.setValue("email", user.email);
      sessionStorage.getItem("code") && setCode(sessionStorage.getItem("code"));
    }
  }, [user, form]);

  async function onSubmit(values: EmailUpdateSchema) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("current_email", user?.email || "");

    try {
      const response = await handleUpdateUserAttribute(formData);

      if (response.includes("success")) {
        toast.success("Email updated successfully!");
        sessionStorage.setItem("code", String(response[0]));
      } else {
        toast.error(response);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }
  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div>
        <h1 className="text-2xl font-semibold">Update Email</h1>
      </div>
      {code && <CodeUpdate />}
      {!code && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Name Input Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g: admin@gmail.com" {...field} />
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
                "Update Profile"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
