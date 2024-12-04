"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useOrganization } from "~/hooks/useOrganization";
import { z } from "zod";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { updateOrg } from "~/server/actions/settings";

const formSchema = z.object({
  standardAnalyticsRecordingLimit: z.coerce
    .number()
    .max(100_000_000_000, { message: "Limit too hight" }),
  playbackAnalyticsRecordingLimit: z.coerce
    .number()
    .max(100_000_000_000, { message: "Limit too hight" }),
  seatsLimit: z.coerce
    .number()
    .min(1, { message: "Must have at least 1 seat" }),
});

export function UpdateButton({
  userId,
  currentStandardRecordingLimit,
  currentPlaybackRecordingLimit,
  currentSeatsLimit,
}: {
  userId: string;
  currentStandardRecordingLimit: number;
  currentPlaybackRecordingLimit: number;
  currentSeatsLimit: number;
}) {
  const organization = useOrganization((state) => state.organization);
  const org = organization?.organization!;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      standardAnalyticsRecordingLimit: currentStandardRecordingLimit,
      playbackAnalyticsRecordingLimit: currentPlaybackRecordingLimit,
      seatsLimit: currentSeatsLimit,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await updateOrg(
      org.id,
      data.standardAnalyticsRecordingLimit,
      data.playbackAnalyticsRecordingLimit,
      data.seatsLimit,
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-md bg-zinc-700 px-10 py-1 text-sm">
          Update
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-zinc-900 text-zinc-50">
        <form
          className="flex flex-col gap-y-6 rounded-lg p-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            name="standardAnalyticsRecordingLimit"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col items-end gap-y-1">
                <div className="flex w-full flex-col items-start gap-y-2">
                  <span className="text-sm">
                    Standard Analytics Recording Limit:
                  </span>
                  <input
                    {...field}
                    className="w-full rounded-md bg-zinc-600 px-2 py-1"
                  />
                </div>
                {fieldState.error ? (
                  <span className="rounded-md bg-zinc-700 px-2 py-1 font-medium text-red-500">
                    {fieldState.error.message}
                  </span>
                ) : null}
              </div>
            )}
          />
          <Controller
            name="playbackAnalyticsRecordingLimit"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col items-end gap-y-1">
                <div className="flex w-full flex-col items-start gap-y-2">
                  <span className="text-sm">Playback Recording Limit:</span>
                  <input
                    {...field}
                    className="w-full rounded-md bg-zinc-600 px-2 py-1"
                  />
                </div>
                {fieldState.error ? (
                  <span className="rounded-md bg-zinc-700 px-2 py-1 font-medium text-red-500">
                    {fieldState.error.message}
                  </span>
                ) : null}
              </div>
            )}
          />
          <Controller
            name="seatsLimit"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col items-end gap-y-1">
                <div className="flex w-full flex-col items-start gap-y-2">
                  <span className="text-sm">Seats Limit:</span>
                  <input
                    {...field}
                    className="w-full rounded-md bg-zinc-600 px-2 py-1"
                  />
                </div>
                {fieldState.error ? (
                  <span className="rounded-md bg-zinc-700 px-2 py-1 font-medium text-red-500">
                    {fieldState.error.message}
                  </span>
                ) : null}
              </div>
            )}
          />

          <button className="rounded-md bg-zinc-600 px-2 py-1" type="submit">
            Save
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
