type FlowChainProps = {
  steps: string[];
  activeIndex: number;
  orientation?: "vertical" | "horizontal";
};

export function FlowChain({
  steps,
  activeIndex,
  orientation = "vertical",
}: FlowChainProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={
        isHorizontal
          ? "flex flex-wrap items-center gap-2"
          : "flex flex-col gap-2"
      }
    >
      {steps.map((step, index) => {
        const state =
          index < activeIndex
            ? "done"
            : index === activeIndex
              ? "active"
              : "idle";
        const base =
          "rounded-lg border px-3 py-2 text-sm transition-all duration-300 min-w-[10rem] text-left " +
          (state === "done"
            ? "border-[var(--gold-border)] bg-[var(--gold-dim)] text-foreground"
            : state === "active"
              ? "border-[var(--gold)] bg-background text-foreground anim-flow-pulse"
              : "border-border bg-background/60 text-muted-foreground");

        return (
          <div
            key={step}
            className={
              isHorizontal ? "flex items-center gap-2" : "flex flex-col gap-2"
            }
          >
            <div className={base}>{step}</div>
            {index < steps.length - 1 && (
              <span
                className={
                  isHorizontal
                    ? "text-muted-foreground text-xs"
                    : "text-muted-foreground text-xs pl-1"
                }
              >
                ↓
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
