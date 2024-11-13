"use client";

import { CheckIcon, Clipboard as Clipbrd } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyToClipboardButton({ value }: { value: string }) {
  const [hasCopied, setHasCopied] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  }, [hasCopied]);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setHasCopied(true);
      }}
      className="absolute bottom-2 right-2 rounded-md bg-zinc-600 px-1.5 py-2"
    >
      {hasCopied ? <CheckIcon height={18} /> : <Clipbrd height={18} />}
    </button>
  );
}
