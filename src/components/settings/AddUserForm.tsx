"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  addMemberToCompany,
  isExistingEmail,
} from "~/server/actions/addUserToCompany";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useCompany } from "~/hooks/useCompany";
import { useState } from "react";

export function AddUserForm({
  setter,
}: {
  setter: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const company = useCompany((state) => state.company)!;
  const [userId, setUserId] = useState("");
  const formSchema = z.object({
    email: z
      .string()
      .email()
      .refine(
        (email) => {
          if (company.client?.users.find((u) => u.user?.email === email)) {
            return false;
          }
          return true;
        },
        { message: "This user is already a member of this company." },
      )
      .refine(
        async (email) => {
          const activeUserId = await isExistingEmail(email);
          if (activeUserId) {
            setUserId(activeUserId);
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

  function onSubmit(_: z.infer<typeof formSchema>) {
    setter(false);
    addMemberToCompany(userId, company.client?.id!);
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
