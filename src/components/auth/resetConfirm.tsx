"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { handleConfirmResetPassword } from "@/lib/actions/cognitoActions";

import {
  formDefaultValues,
  resetPasswordSchema,
  ResetPasswordSchema,
} from "@/lib/zod/auth/reset-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getErrorMessage } from "../../utlis/get-error-message";
import ButtonLoader from "../button-loader";
import { PasswordInput } from "../password-input";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export default function ResetConfirm() {
  const { push } = useRouter();
  const form = useForm<ResetPasswordSchema>({
    mode: "all",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      push("/");
    } else {
      form.setValue("email", storedEmail);
    }
  }, [push, form]);

  async function onSubmit(values: ResetPasswordSchema) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);
    formData.append("confirmationCode", values.confirmationCode);
    try {
      const res = await handleConfirmResetPassword(formData);
      if (typeof res !== "string" && res?.status === "success") {
        toast.success(res.message);
        // clear the email from session storage
        sessionStorage.removeItem("email");
        push("/");
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
            Confirm your email and set a new password
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
                      disabled
                      placeholder="e.g: monirhossain6163@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirmation Code
                    <span className="text-gray-500 ml-1">
                      (Check your email)
                    </span>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="e.g: ********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="e.g: ********" {...field} />
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
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </Fragment>
  );
}
