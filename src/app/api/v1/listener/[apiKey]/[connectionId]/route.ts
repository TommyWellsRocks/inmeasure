import { authorizeAndWriteMessage } from "~/server/db/queries/listenerAPI";
import type {
  GoldEventMessage,
  SilverEventMessage,
  BrowserMessage,
  BronzeEventMessage,
} from "~/server/types/analytics";
import { getDomain } from "~/utils/getDomain";

export async function POST(
  req: Request,
  { params }: { params: { apiKey: string; connectionId: string } },
) {
  const data:
    | BrowserMessage
    | BronzeEventMessage
    | SilverEventMessage
    | GoldEventMessage = await req.json();
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
