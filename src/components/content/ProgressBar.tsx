import { Progress } from "@/components/ui/progress";

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between font-product-body text-xs text-marin-dark-gray dark:text-stone-400">
        <span>{label ?? "Progress"}</span>
        <span aria-hidden="true">{clamped}%</span>
      </div>
      <Progress
        value={clamped}
        aria-label={label ?? "Progress"}
        aria-valuetext={`${clamped}%`}
      />
    </div>
  );
}
