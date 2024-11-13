import { scripts } from "~/server/types/tiers";
import { readFile } from "fs/promises";
import { getDomain } from "~/utils/getDomain";
import { authorizeAndCreateConnection } from "~/server/db/queries/scriptAPI";

export async function GET(
  req: Request,
  { params }: { params: { apiKey: string } },
  _: Response,
) {
  const apiKey = params.apiKey;
  const origin = req.headers.get("referer");

  if (origin) {
    const domain = getDomain(origin);
    const authResponse = await authorizeAndCreateConnection(domain, apiKey);

    if (authResponse) {
      const connectionId = authResponse.connectionId;
      let script = await readFile(scripts[authResponse.clientTier], "utf-8");

      const replacements = {
        "{{APIKEY}}": apiKey,
        "{{CONNECTIONID}}": connectionId,
      };
      Object.entries(replacements).forEach(
        ([placeholder, value]) =>
          (script = script.replaceAll(placeholder, value)),
      );

      return new Response(script, {
        headers: { "Content-Type": "application/javascript" },
      });
    }
  }
  return new Response();
}
