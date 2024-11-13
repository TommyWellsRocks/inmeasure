"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { addCompany, isCompanyDomain } from "~/server/actions/addCompany";

import type { AnalyticsLevelType } from "~/server/types/tiers";
import { getDomain } from "~/utils/getDomain";

const tiers = ["bronze", "silver", "gold"];

const formSchema = z.object({
  companyName: z
    .string()
    .min(2, {
      message: "Company name must be at least 2 characters.",
    })
    .max(50, { message: "Company name must be at most 50 characters." }),
  domain: z
    .string()
    .url()
    .refine(
      async (url) => {
        if (await isCompanyDomain(getDomain(url))) {
          return false;
        }
        return true;
      },
      { message: "Client already exists. Join the company." },
    ),
  tier: z.string().refine((t) => tiers.includes(t), {
    message: "Company tier must be one from the list.",
  }),
});

export function AddCompanyForm({ userId }: { userId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      domain: "",
      tier: "bronze",
    },
  });

  function onSubmit(v: z.infer<typeof formSchema>) {
    addCompany(userId, v.companyName, v.domain, v.tier as AnalyticsLevelType);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-5"
      >
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="InMeasure"
                  {...field}
                  className="bg-zinc-900"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input
                  placeholder="inmeasure.com"
                  {...field}
                  className="bg-zinc-900"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Suggestion: Copy the URL directly from your browser.
              </FormDescription>
              <FormDescription>
                The subdomain and top level domain (TLD) matter.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tier</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-zinc-900">
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-900 text-zinc-50">
                  {tiers.map((t, i) => (
                    <SelectItem key={i} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Company</Button>
      </form>
    </Form>
  );
}
