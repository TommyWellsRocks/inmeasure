import { getDomain } from "~/utils/getDomain";
import { authorizeAndCreateConnection } from "~/server/db/queries/apis/scriptAPI";
import { returnScriptMap } from "~/server/types/scripts";
import { replaceOnScript } from "~/scripts/get/utils/replaceOnScript";

export async function GET(
  req: Request,
  { params }: { params: { apiKey: string } },
  _: Response,
) {
  const apiKey = params.apiKey;
  const origin = req.headers.get("referer");

  let status = 200;
  let statusText = "";

  if (origin) {
    const domain = getDomain(origin);
    const { res, responseStatus, responseMessage } =
      await authorizeAndCreateConnection(domain, apiKey);
    status = responseStatus;
    statusText = responseMessage;

    if (res) {
      const connectionId = res.connectionId;
      if (!res.scriptType) {
        statusText = "Limits Reached.";
      } else {
        const script = returnScriptMap[res.scriptType];
        const totalScript = replaceOnScript(apiKey, connectionId, script);

        console.log(`Send Script To Domain: ${domain}.`);

        return new Response(totalScript, {
          headers: { "Content-Type": "application/javascript" },
        });
      }
    }
  } else {
    console.warn(`ScriptAPI - No Origin Error - APIKEY: ${apiKey}.`);
    status = 400;
    statusText = "No Origin.";
  }

  return new Response(undefined, { status, statusText });
}
