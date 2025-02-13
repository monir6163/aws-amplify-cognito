"use client";

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
import { handlePasswordReset } from "@/lib/actions/cognitoActions";
import {
  emailUpdateSchema,
  EmailUpdateSchema,
  formDefaultValues,
} from "@/lib/zod/auth/email-update";

import { getErrorMessage } from "@/utlis/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPassword() {
  const { push } = useRouter();
  const form = useForm<EmailUpdateSchema>({
    mode: "all",
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: formDefaultValues,
  });
  async function onSubmit(values: EmailUpdateSchema) {
    const formData = new FormData();
    formData.append("email", values.email);
    try {
      const res = await handlePasswordReset(formData);
      if (typeof res !== "string" && res?.status === "success") {
        toast.success(res.message);
        sessionStorage.setItem("email", values.email);
        push("/reset-password/confirm");
      } else {
        toast.error(typeof res === "string" ? res : res.message);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  }
  return (
    <Fragment>
      <div className="space-y-4 border rounded-lg p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            Forgot Password? No Worries!
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g: monirhossain6163@gmail.com"
                      {...field}
                    />
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
                "Send Code to Email"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </Fragment>
  );
}
