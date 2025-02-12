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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { handleConfirmUserAttribute } from "@/lib/actions/cognitoActions";
import { codeSchema, CodeSchema, formDefaultValues } from "@/lib/zod/auth/code";

import { getErrorMessage } from "@/utlis/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CodeUpdate() {
  const form = useForm<CodeSchema>({
    mode: "all",
    resolver: zodResolver(codeSchema),
    defaultValues: formDefaultValues,
  });

  async function onSubmit(values: CodeSchema) {
    const formData = new FormData();
    formData.append("confirmationCode", values.code);
    try {
      const res = await handleConfirmUserAttribute(formData);
      if (typeof res !== "string" && res?.status === "success") {
        toast.success(res.message);
        sessionStorage.removeItem("code");
      } else {
        toast.error(typeof res === "string" ? res : res.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Confirmation Code
                <span className="text-gray-500 ml-1">(Check your email)</span>
              </FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
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
          {form.formState.isSubmitting ? <ButtonLoader /> : "Verify Email"}
        </Button>
      </form>
    </Form>
  );
}
