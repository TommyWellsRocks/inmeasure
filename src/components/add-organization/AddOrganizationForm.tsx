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
import {
  getPlaybackAnalyticsPrice,
  getSeatsPrice,
  getStandardAnalyticsPrice,
} from "~/utils/pricingFunctions";

import type { SeatOption } from "~/server/types/InMeasure";

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
  seatsLimit: z.string(),
});

export function AddOrganizationForm({ userId }: { userId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      domain: "",
      standardScriptLimit: 10_000,
      playbackScriptLimit: 100,
      seatsLimit: "1",
    },
  });

  function onSubmit(v: z.infer<typeof formSchema>) {
    addOrganization(
      userId,
      v.organizationName,
      v.domain,
      v.standardScriptLimit,
      v.playbackScriptLimit,
      v.seatsLimit as SeatOption,
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
                  className="bg-zinc-900"
                  {...field}
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
                  className="bg-zinc-900"
                  {...field}
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
              <FormLabel>Standard Connections Limit</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  type="number"
                  placeholder="10,000"
                  className="bg-zinc-900"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <div className="flex justify-between">
                <FormDescription>
                  Max standard connection analytics for site visitors.
                </FormDescription>
                <FormDescription>
                  ${getStandardAnalyticsPrice(field.value).toFixed(2)}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="playbackScriptLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Replay Connections Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="1,000"
                  className="bg-zinc-900"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <div className="flex justify-between">
                <FormDescription>
                  Max session replays for site visitors.
                </FormDescription>
                <FormDescription>
                  ${getPlaybackAnalyticsPrice(field.value).toFixed(2)}
                </FormDescription>
              </div>
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
                  <SelectItem value="Unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
              <div className="flex justify-between">
                <FormDescription>
                  You can manage seats in your{" "}
                  <Link href="/settings#organization" className="underline">
                    organization settings
                  </Link>
                  .
                </FormDescription>
                <FormDescription>
                  ${getSeatsPrice(field.value as SeatOption)}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex flex-col text-end text-zinc-500">
          <span>
            Monthly spend limit: $
            {(
              getStandardAnalyticsPrice(form.watch("standardScriptLimit")) +
              getPlaybackAnalyticsPrice(form.watch("playbackScriptLimit")) +
              getSeatsPrice(form.watch("seatsLimit") as SeatOption)
            ).toFixed(2)}
          </span>
          <span className="text-xs">
            This can be updated anytime in organization settings.
          </span>
        </div>
        <Button type="submit">Add Organization</Button>
      </form>
    </Form>
  );
}
