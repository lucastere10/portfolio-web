import { Pause, Play, RotateCcw } from "lucide-react";

type ControlBarProps = {
  isRunning: boolean;
  onRun: () => void;
  onPause?: () => void;
  onReset: () => void;
  runLabel?: string;
};

export function ControlBar({
  isRunning,
  onRun,
  onPause,
  onReset,
  runLabel = "Run simulation",
}: ControlBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background/90 p-2.5">
      <button
        type="button"
        onClick={onRun}
        className="inline-flex items-center gap-2 rounded-md border border-(--gold-border) bg-(--gold-dim) px-3 py-1.5 text-sm font-medium text-foreground hover:opacity-85 transition-opacity cursor-pointer"
      >
        <Play className="w-4 h-4" /> {runLabel}
      </button>
      {onPause && (
        <button
          type="button"
          onClick={onPause}
          disabled={!isRunning}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <Pause className="w-4 h-4" /> Pause
        </button>
      )}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" /> Reset
      </button>
    </div>
  );
}
