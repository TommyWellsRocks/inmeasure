export function replaceOnScript(
  apiKey: string,
  connectionId: string,
  script: string,
) {
  const replacements = {
    "{{APIKEY}}": apiKey,
    "{{CONNECTIONID}}": connectionId,
  };
  let newScript = script;
  Object.entries(replacements).forEach(
    ([placeholder, value]) =>
      (newScript = newScript.replaceAll(placeholder, value)),
  );
  return newScript;
}
