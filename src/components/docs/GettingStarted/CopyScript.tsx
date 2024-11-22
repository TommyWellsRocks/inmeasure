import { copyScript } from "~/server/types/scripts";
import { ScriptSection } from "./ScriptSection";

export async function CopyScript() {
  return (
    <div className="flex flex-col gap-y-2">
      <span className="text-sm">Copy this to your site.</span>
      <ScriptSection defaultScript={copyScript} />
      <div className="flex flex-col text-sm">
        <span>
          If you have a layout component (something that applies to every page
          of your site), then paste it there.
        </span>
        <span>
          Otherwise, you might need to add it to every page of your site.
        </span>
      </div>
    </div>
  );
}
