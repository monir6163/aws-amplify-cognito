"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userSignIn } from "@/lib/actions/cognitoActions";
import {
  formDefaultValues,
  SignInSchema,
  signInSchema,
} from "@/lib/zod/auth/signIn";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getErrorMessage } from "../../utlis/get-error-message";
import ButtonLoader from "../button-loader";
import { PasswordInput } from "../password-input";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function SignIn() {
  const { push } = useRouter();
  const form = useForm<SignInSchema>({
    mode: "all",
    resolver: zodResolver(signInSchema),
    defaultValues: formDefaultValues,
  });
  async function onSubmit(values: SignInSchema) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    try {
      const res = await userSignIn(undefined, formData);
      if (typeof res !== "string" && res?.status === "success") {
        toast.success(res.message);
        push("/dashboard");
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
          <h1 className="text-2xl font-semibold">Sign In to Your Account</h1>
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

            <Button
              disabled={form.formState.isSubmitting}
              className="w-full inline-flex items-center"
              type="submit"
            >
              {form.formState.isSubmitting ? <ButtonLoader /> : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="text-center grid grid-cols-1 gap-2">
          <p>
            Forgot your password?{" "}
            <Link
              href="/reset-password"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Reset Password
            </Link>
          </p>
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
