import type { Course } from "./course-search";

const CapacityBar = ({
    enrolled,
    capacity,
    waitlist,
}: Pick<Course, "enrolled" | "capacity" | "waitlist">) => {
    const total = Math.max(capacity, enrolled + waitlist);
    const pct = (n: number) => `${(n / total) * 100}%`;
    const free = Math.max(0, capacity - enrolled);

    return (
        <div className="space-y-2">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="bg-foreground/80" style={{ width: pct(enrolled) }} />
                <div className="bg-success/70" style={{ width: pct(free) }} />
                <div className="bg-warning/40" style={{ width: pct(waitlist) }} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs tabular-nums text-muted-foreground">
                <span>
                    <span className="inline-block size-2 translate-y-px rounded-full bg-foreground/80" />{" "}
                    {enrolled} enrolled
                </span>
                <span>
                    <span className="inline-block size-2 translate-y-px rounded-full bg-success/70" />{" "}
                    {free} free
                </span>
                <span>
                    <span className="inline-block size-2 translate-y-px rounded-full bg-warning/40" />{" "}
                    {waitlist} waiting
                </span>
            </div>
        </div>
    );
};

export default CapacityBar;
