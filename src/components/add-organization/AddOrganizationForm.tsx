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
  addOrganization,
  isOrganizationDomain,
} from "~/server/actions/addOrganization";

import { getDomain } from "~/utils/getDomain";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";

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
  standardScriptLimit: z.coerce.number(),
  playbackScriptLimit: z.coerce.number(),
  seatsLimit: z.coerce.number(),
});

export function AddOrganizationForm({ userId }: { userId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      domain: "",
      standardScriptLimit: 10_000,
      playbackScriptLimit: 1_000,
      seatsLimit: 1,
    },
  });

  function onSubmit(v: z.infer<typeof formSchema>) {
    addOrganization(
      userId,
      v.organizationName,
      v.domain,
      v.standardScriptLimit,
      v.playbackScriptLimit,
      v.seatsLimit,
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
                  placeholder="https://www.inmeasure.com"
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
          name="standardScriptLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Standard Connections</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  type="number"
                  placeholder="10,000"
                  {...field}
                  className="bg-zinc-900"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>Logged site visitor cap.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="playbackScriptLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Replay Connections</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="1,000"
                  {...field}
                  className="bg-zinc-900"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Logged site visitor session replay cap.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seatsLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seat Limit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue="1">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="1" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="0">Unlimited</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage seats in your{" "}
                <Link href="/settings#organization" className="underline">
                  organization settings
                </Link>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Organization</Button>
      </form>
    </Form>
  );
}
