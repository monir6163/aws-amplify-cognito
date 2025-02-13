"use client";

import ButtonLoader from "@/components/button-loader";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { handlePasswordChange } from "@/lib/actions/cognitoActions";
import {
  formDefaultValues,
  passwordSchema,
  PasswordSchema,
} from "@/lib/zod/auth/password";
import { getErrorMessage } from "@/utlis/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import LogoutModal from "./logout-modal";

export default function PasswordForm() {
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const form = useForm<PasswordSchema>({
    mode: "all",
    resolver: zodResolver(passwordSchema),
    defaultValues: formDefaultValues,
  });
  async function onSubmit(values: PasswordSchema) {
    try {
      const formData = new FormData();
      formData.append("current_password", values.current_password);
      formData.append("password", values.password);
      const res = await handlePasswordChange(formData);
      if (typeof res !== "string" && res?.status === "success") {
        toast.success(res.message);
        form.reset();
        setTimeout(() => {
          setShowLogoutModal(true);
        }, 2000);
      } else {
        toast.error(typeof res === "string" ? res : res.message);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  }
  return (
    <div className="space-y-4 border rounded-lg p-4">
      <h1 className="text-2xl font-semibold">Update Password</h1>
      <LogoutModal
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="e.g: ********" {...field} />
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
                <FormLabel>New Password</FormLabel>
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
            {form.formState.isSubmitting ? <ButtonLoader /> : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
