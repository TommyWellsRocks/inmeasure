"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isExistingEmail } from "~/server/actions/addUserToOrganization";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useOrganization } from "~/hooks/useOrganization";

type formUser = {
  id: string;
  name: string | null;
  email: string;
};

export function AddUserForm({
  setter,
}: {
  setter: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const organization = useOrganization((state) => state.organization)!;
  const addUserToOrganization = useOrganization.getState().addOrganizationUser;
  let userId = "";
  let userName = "";
  const formSchema = z.object({
    email: z
      .string()
      .email()
      .refine(
        (email) => {
          if (
            organization.organization?.users.find(
              (u) => u.user?.email === email,
            )
          ) {
            return false;
          }
          return true;
        },
        { message: "This user is already a user of this organization." },
      )
      .refine(
        async (email) => {
          const { value: activeUser, err } = await isExistingEmail(email);
          if (err) return false;

          if (activeUser) {
            userId = activeUser.id;
            userName = activeUser.name || "New User";
            return true;
          }
          return false;
        },
        {
          message: "No InMeasure user with this email.",
        },
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(v: z.infer<typeof formSchema>) {
    setter(false);
    addUserToOrganization(userId, userName, v.email);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@gmail.com"
                  {...field}
                  className="bg-zinc-900"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          className="rounded-md bg-zinc-500 py-2 text-sm text-zinc-50"
        >
          Add User
        </button>
      </form>
    </Form>
  );
}
