type NarrativeProgressProps = {
  items: string[];
  activeIndex: number;
};

export function NarrativeProgress({
  items,
  activeIndex,
}: NarrativeProgressProps) {
  return (
    <div className="rounded-lg border border-border bg-background/80 p-3">
      <p className="text-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-2">
        Experience progression
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const isDone = activeIndex > index;

          return (
            <div
              key={item}
              className={`rounded-md border px-2.5 py-2 text-xs leading-relaxed ${
                isDone
                  ? "border-(--gold-border) bg-(--gold-dim) text-foreground"
                  : isActive
                    ? "border-gold bg-background text-foreground anim-flow-pulse"
                    : "border-border text-muted-foreground"
              }`}
            >
              <span className="text-mono mr-1">{index + 1}.</span>
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
