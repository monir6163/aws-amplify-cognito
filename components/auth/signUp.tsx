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
  formDefaultValues,
  signUpSchema,
  SignUpSchema,
} from "@/lib/zod/signUp";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import ButtonLoader from "../button-loader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function SignUp() {
  const form = useForm<SignUpSchema>({
    mode: "all",
    resolver: zodResolver(signUpSchema),
    defaultValues: formDefaultValues,
  });
  async function onSubmit(values: SignUpSchema) {
    console.log(values);
  }
  return (
    <Fragment>
      <div className="space-y-4 border rounded-lg p-4">
        <div>
          <h1 className="text-2xl font-semibold">Sign Up</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g: Monir Hossain" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g: ********" {...field} />
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
                      <Input placeholder="e.g: ********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={form.formState.isSubmitting}
              className="w-full inline-flex items-center"
              type="submit"
            >
              {form.formState.isSubmitting ? <ButtonLoader /> : "Sign Up"}
            </Button>
          </form>
        </Form>
        <div>
          <p>
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </Fragment>
  );
}
