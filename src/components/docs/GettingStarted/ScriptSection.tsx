"use client";

import Link from "next/link";
import { useOrganization } from "~/hooks/useOrganization";

import { CopyToClipboardButton } from "../CopyToClipboardButton";

export function ScriptSection({ defaultScript }: { defaultScript: string }) {
  const apiKey = useOrganization(
    (state) => state.organization?.organization?.apiKey,
  );
  let realScript = "";
  if (apiKey) {
    realScript = defaultScript.replaceAll("{{APIKEY}}", apiKey);
  }
  return (
    <div className="relative rounded-md bg-zinc-900 p-4 italic">
      {realScript ? (
        <>
          {realScript}
          <CopyToClipboardButton value={realScript} />
        </>
      ) : (
        <span>
          <Link href="add-organization" className="underline">
            Add your organization
          </Link>{" "}
          to view your script...
        </span>
      )}
    </div>
  );
}
