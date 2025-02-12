"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  handleConfirmSignUp,
  sendEmailVerificationCode,
} from "@/lib/actions/cognitoActions";
import {
  confirmSignUpSchema,
  ConfirmSignUpSchema,
  formDefaultValues,
} from "@/lib/zod/auth/confirmSignUp";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getErrorMessage } from "../../utlis/get-error-message";
import ButtonLoader from "../button-loader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Separator } from "../ui/separator";

export default function EmailVerify() {
  const { push } = useRouter();
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30); // 30 seconds

  const form = useForm<ConfirmSignUpSchema>({
    mode: "all",
    resolver: zodResolver(confirmSignUpSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      push("/signup");
    } else {
      form.setValue("email", storedEmail);
    }
  }, [push, form]);

  useEffect(() => {
    if (resendDisabled && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  async function onSubmit(values: ConfirmSignUpSchema) {
    setIsConfirmLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("confirmationCode", values.confirmationCode);
      const res = await handleConfirmSignUp(formData);
      if (typeof res !== "string" && res?.status === "success") {
        toast.success(res.message);
        // clear the email from session storage
        sessionStorage.removeItem("email");
        push("/signin");
      } else {
        toast.error(typeof res === "string" ? res : res.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsConfirmLoading(false);
    }
  }

  // Resend confirmation code
  async function handleResendCode() {
    setIsResendLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", form.getValues("email"));
      const res = await sendEmailVerificationCode(formData);
      if (typeof res !== "string" && res?.status === "success") {
        toast.success(res.message);
        setCountdown(30);
        setResendDisabled(true);
      } else {
        toast.error(typeof res === "string" ? res : res.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsResendLoading(false);
    }
  }

  return (
    <Fragment>
      <div className="space-y-4 border rounded-lg p-4">
        <div>
          <h1 className="text-2xl font-semibold">Confirm Your Email Address</h1>
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
                      disabled
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

            <Button
              disabled={isConfirmLoading}
              className="w-full inline-flex items-center"
              type="submit"
            >
              {isConfirmLoading ? <ButtonLoader /> : "Confirm"}
            </Button>

            <Separator orientation="horizontal" className="my-4" />

            <Button
              disabled={resendDisabled || isResendLoading}
              className="w-full inline-flex items-center"
              type="button"
              onClick={handleResendCode}
            >
              {isResendLoading ? (
                <ButtonLoader />
              ) : resendDisabled ? (
                `Resend Code (${countdown}s)`
              ) : (
                "Resend Code"
              )}
            </Button>
          </form>
        </Form>

        <div>
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </Fragment>
  );
}
