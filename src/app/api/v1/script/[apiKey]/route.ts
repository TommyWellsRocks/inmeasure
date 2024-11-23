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

  if (origin) {
    const domain = getDomain(origin);
    const res = await authorizeAndCreateConnection(domain, apiKey);

    if (res) {
      const connectionId = res.connectionId;
      if (!res.scriptType) return new Response();

      const script = returnScriptMap[res.scriptType];
      const totalScript = replaceOnScript(apiKey, connectionId, script);

      console.log(`Sending scriptType: ${res.scriptType}. Domain: ${domain}`);

      return new Response(totalScript, {
        headers: { "Content-Type": "application/javascript" },
      });
    }
  }

  return new Response();
}
