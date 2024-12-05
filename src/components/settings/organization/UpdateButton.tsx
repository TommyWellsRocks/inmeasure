"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";

import { isOrganizationDomain } from "~/server/actions/addOrganization";
import { updateOrg } from "~/server/actions/settings";

import { getDomain } from "~/utils/getDomain";
import {
  getPlaybackAnalyticsPrice,
  getSeatsPrice,
  getStandardAnalyticsPrice,
} from "~/utils/pricingFunctions";

import type { Organization, SeatOption } from "~/server/types/InMeasure";

export function UpdateButton({
  currentOrg,
}: {
  currentOrg: Organization["organization"];
}) {
  if (!currentOrg) return;
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
          const newUrl = getDomain(url);
          const isTaken = await isOrganizationDomain(newUrl);
          if (isTaken && newUrl === currentOrg.domain) {
            return true;
          } else if (isTaken) {
            return false;
          }
          return true;
        },
        { message: "Organization already exists. Join the organization." },
      ),
    standardScriptLimit: z.coerce
      .number()
      .max(100_000_000_000, { message: "Limit too hight" }),
    playbackScriptLimit: z.coerce
      .number()
      .max(100_000_000_000, { message: "Limit too hight" }),
    seatsLimit: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: currentOrg.organizationName,
      domain: "https://" + currentOrg.domain,
      standardScriptLimit: currentOrg.standardScriptLimit,
      playbackScriptLimit: currentOrg.playbackScriptLimit,
      seatsLimit:
        currentOrg.seatsLimit === 0
          ? "Unlimited"
          : String(currentOrg.seatsLimit),
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await updateOrg(
      currentOrg!.id,
      data.organizationName,
      data.domain,
      data.standardScriptLimit,
      data.playbackScriptLimit,
      data.seatsLimit as SeatOption,
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-md bg-zinc-700 px-10 py-1 text-sm">
          Update
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] bg-zinc-900 text-zinc-50">
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
                  <FormDescription className="text-end">
                    ${getSeatsPrice(field.value as SeatOption)}
                  </FormDescription>
                </FormItem>
              )}
            />
            <span className="flex flex-col text-end text-zinc-500">
              Monthly spend limit: $
              {(
                getStandardAnalyticsPrice(form.watch("standardScriptLimit")) +
                getPlaybackAnalyticsPrice(form.watch("playbackScriptLimit")) +
                getSeatsPrice(form.watch("seatsLimit") as SeatOption)
              ).toFixed(2)}
            </span>
            <Button type="submit" className="bg-zinc-600">
              Save
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
