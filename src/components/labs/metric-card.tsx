type MetricCardProps = {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warning" | "critical";
};

const toneClassMap: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  neutral: "border-border bg-background",
  good: "border-emerald-500/35 bg-emerald-500/10",
  warning: "border-amber-500/35 bg-amber-500/10",
  critical: "border-red-500/35 bg-red-500/10 anim-alert-flash",
};

export function MetricCard({
  label,
  value,
  tone = "neutral",
}: MetricCardProps) {
  return (
    <div
      className={`rounded-lg border p-3 ${toneClassMap[tone]} anim-metric-pop`}
    >
      <p className="text-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-semibold mt-1 text-foreground">{value}</p>
    </div>
  );
}
