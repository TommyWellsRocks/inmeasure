import { getDomain } from "~/utils/getDomain";
import { authorizeAndCreateConnection } from "~/server/db/queries/apis/scriptAPI";
import {
  sessionRecordingScript,
  standardScript,
  durationScript,
} from "~/server/types/scripts";
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

      const theStandardScript = res.scripts.returnStandardScript
        ? durationScript + standardScript
        : "";
      const theRecordingScript = res.scripts.returnRecordingScript
        ? sessionRecordingScript
        : "";

      // ! FUNCTION AND VAR NAMES MUST BE DIFFERENT BETWEEN SCRIPTS
      const totalScript = replaceOnScript(
        apiKey,
        connectionId,
        theStandardScript + theRecordingScript,
      );

      return new Response(totalScript, {
        headers: { "Content-Type": "application/javascript" },
      });
    }
  }

  return new Response();
}
