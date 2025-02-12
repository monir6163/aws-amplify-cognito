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
  formDefaultValues,
  profileUpdateSchema,
  ProfileUpdateSchema,
} from "@/lib/zod/auth/profile-update";
import { getErrorMessage } from "@/utlis/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import EmailUpdate from "./email-form";

export default function ProfileDetails() {
  const user = useAuthUser();
  const form = useForm<ProfileUpdateSchema>({
    mode: "all",
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("phone_number", user.phone_number);
    }
  }, [user, form]);

  async function onSubmit(values: ProfileUpdateSchema) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone_number", values.phone_number);
    formData.append("current_name", user?.name || "");
    formData.append("current_phone_number", user?.phone_number || "");

    try {
      const response = await handleUpdateUserAttribute(formData);
      if (response.includes("success")) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Profile Picture Section */}
        <div className="col-span-1 p-3 shadow-md">
          <div className="space-y-4 border rounded-lg p-4">
            <div>
              <h1 className="text-2xl font-semibold">Profile Picture</h1>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://res.cloudinary.com/ddxqljriw/image/upload/v1711623691/samples/man-portrait.jpg"
                width={150}
                height={150}
                className="rounded-full h-32 w-32"
                alt="profile"
              />
            </div>
            <div>
              <Button className="w-full">Upload Picture</Button>
            </div>
          </div>

          {/* User Info Display */}
          <div>
            <h1 className="font-semibold mt-4">
              User Name: <span className="text-sm">{user?.name}</span>
            </h1>
            <p className="mt-2 font-semibold">
              Email: <span className="text-sm">{user?.email}</span>
            </p>
            <p className="mt-2 font-semibold">
              Phone Number:{" "}
              <span className="text-sm">{user?.phone_number}</span>
            </p>
          </div>
        </div>

        {/* Profile Update Form */}
        <div className="col-span-2">
          <div className="space-y-4 border rounded-lg p-4">
            <div>
              <h1 className="text-2xl font-semibold">
                Update Your Profile Details
              </h1>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Name Input Field */}
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

                {/* Phone Number Input Field */}
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g: +88017xxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
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
          </div>
        </div>
      </div>
      <EmailUpdate />
    </div>
  );
}
