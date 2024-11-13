export function SettingsItem({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex gap-x-2">
      <span className="font-medium">{name}:</span>
      <span className="font-extralight">{value}</span>
    </div>
  );
}
