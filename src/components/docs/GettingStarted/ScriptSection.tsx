"use client";

import Link from "next/link";
import { useCompany } from "~/hooks/useCompany";

import { CopyToClipboardButton } from "../CopyToClipboardButton";

export function ScriptSection({ defaultScript }: { defaultScript: string }) {
  const apiKey = useCompany((state) => state.company?.client?.apiKey);
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
          <Link href="add-company" className="underline">
            Add your company
          </Link>{" "}
          to view your script...
        </span>
      )}
    </div>
  );
}
