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
import {
  addOrganization,
  isOrganizationDomain,
} from "~/server/actions/addOrganization";

import type { AnalyticsLevelType } from "~/server/types/tiers";
import { getDomain } from "~/utils/getDomain";

const tiers = ["bronze", "silver", "gold"];

const formSchema = z.object({
  organizationName: z
    .string()
    .min(2, {
      message: "Organization name must be at least 2 characters.",
    })
    .max(50, { message: "Organization name must be at most 50 characters." }),
  domain: z
    .string()
    .url()
    .refine(
      async (url) => {
        if (await isOrganizationDomain(getDomain(url))) {
          return false;
        }
        return true;
      },
      { message: "Organization already exists. Join the organization." },
    ),
  tier: z.string().refine((t) => tiers.includes(t), {
    message: "Organization tier must be one from the list.",
  }),
});

export function AddOrganizationForm({ userId }: { userId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      domain: "",
      tier: "bronze",
    },
  });

  function onSubmit(v: z.infer<typeof formSchema>) {
    addOrganization(
      userId,
      v.organizationName,
      v.domain,
      v.tier as AnalyticsLevelType,
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-5"
      >
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
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
        <Button type="submit">Add Organization</Button>
      </form>
    </Form>
  );
}
