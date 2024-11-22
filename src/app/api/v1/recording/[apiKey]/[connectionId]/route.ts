import { getDomain } from "~/utils/getDomain";
import { authorizeAndWriteMessage } from "~/server/db/queries/apis/recordingAPI";
import type { SessionRecordingMessage } from "~/server/types/scripts";

export async function POST(
  req: Request,
  { params }: { params: { apiKey: string; connectionId: string } },
) {
  const data: SessionRecordingMessage = await req.json();
  const apiKey = params.apiKey;
  const connectionId = params.connectionId;
  const origin = req.headers.get("referer");

  if (origin) {
    const domain = getDomain(origin);
    await authorizeAndWriteMessage(data, domain, apiKey, connectionId);
  }

  console.log(new Blob([JSON.stringify(data)]).size);

  return new Response();
}
