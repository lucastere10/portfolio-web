"use client";

export type ScenarioPreset = "happy" | "degraded" | "outage";

type ScenarioPresetBarProps = {
  value: ScenarioPreset;
  onChange: (preset: ScenarioPreset) => void;
};

const PRESET_META: Record<
  ScenarioPreset,
  { label: string; hint: string; className: string }
> = {
  happy: {
    label: "Happy path",
    hint: "Nominal conditions",
    className: "border-emerald-500/35 bg-emerald-500/10",
  },
  degraded: {
    label: "Degraded",
    hint: "Partial failures",
    className: "border-amber-500/35 bg-amber-500/10",
  },
  outage: {
    label: "Outage",
    hint: "Severe disruption",
    className: "border-red-500/35 bg-red-500/10",
  },
};

export const SCENARIO_FACTORS: Record<
  ScenarioPreset,
  { speed: number; reliability: number; cost: number }
> = {
  happy: { speed: 1, reliability: 1, cost: 1 },
  degraded: { speed: 0.75, reliability: 0.78, cost: 1.26 },
  outage: { speed: 0.45, reliability: 0.46, cost: 1.85 },
};

export function ScenarioPresetBar({
  value,
  onChange,
}: Readonly<ScenarioPresetBarProps>) {
  return (
    <div className="rounded-lg border border-border bg-background/90 p-2.5">
      <p className="text-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-2">
        Scenario preset
      </p>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PRESET_META) as ScenarioPreset[]).map((preset) => {
          const selected = value === preset;
          const meta = PRESET_META[preset];

          return (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={`rounded-md border px-3 py-1.5 text-left transition-all cursor-pointer ${selected ? `${meta.className} anim-flow-pulse` : "border-border bg-background"}`}
            >
              <p className="text-sm font-medium leading-none">{meta.label}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-none">
                {meta.hint}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
