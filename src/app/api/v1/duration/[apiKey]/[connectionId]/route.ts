import { getDomain } from "~/utils/getDomain";
import { authorizeAndWriteMessage } from "~/server/db/queries/apis/durationAPI";
import type { DurationMessage } from "~/server/types/scripts";

export async function POST(
  req: Request,
  { params }: { params: { apiKey: string; connectionId: string } },
) {
  const data: DurationMessage = await req.json();
  const apiKey = params.apiKey;
  const connectionId = params.connectionId;
  const origin = req.headers.get("referer");

  let status = 201;
  let statusText = "";

  if (origin) {
    const domain = getDomain(origin);
    const { responseStatus, responseMessage } = await authorizeAndWriteMessage(
      data,
      domain,
      apiKey,
      connectionId,
    );
    status = responseStatus;
    statusText = responseMessage;
  } else {
    console.warn(
      `DurationAPI - No Origin Error - APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
    );
    status = 400;
    statusText = "No Origin.";
  }

  return new Response(undefined, { status, statusText });
}
