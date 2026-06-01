type SimulationConsoleProps = {
  lines: string[];
};

export function SimulationConsole({ lines }: SimulationConsoleProps) {
  return (
    <div className="rounded-lg border border-border bg-background/90 p-3">
      <p className="text-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-2">
        Live events
      </p>
      <div className="max-h-44 overflow-auto flex flex-col gap-1.5 pr-1">
        {lines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className="text-mono text-xs text-foreground/90 anim-fade-in-line"
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
