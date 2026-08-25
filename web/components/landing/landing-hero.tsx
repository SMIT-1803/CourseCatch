import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CapacityBar from "@/components/capacity-bar";
import CourseChip from "@/components/course-chip";

const LandingHero = () => (
    <section className="mx-auto grid w-full max-w-5xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16">
        <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                SFU · Fall 2026 add/drop
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                goSFU caps you at{" "}
                <span className="font-mono tabular-nums">2</span> waitlists. Watch{" "}
                <span className="text-brand">as many as you want</span>.
            </h1>
            <p className="mt-5 max-w-prose text-pretty text-base leading-relaxed text-muted-foreground">
                CourseCatch keeps an eye on the sections you can&apos;t waitlist and
                sends one email when enrollment moves in your favour. No goSFU login —
                just your email.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                    href="#signin"
                    className={cn(
                        buttonVariants({ size: "lg" }),
                        "bg-brand px-4 text-white hover:bg-brand/90"
                    )}
                >
                    Start watching
                </a>
                <a
                    href="#how"
                    className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "px-4")}
                >
                    How it works
                </a>
            </div>
        </div>

        {/* A watch, as it looks on the dashboard. Illustrative figures. */}
        <div>
            <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                <div className="flex items-baseline gap-2 text-sm">
                    <CourseChip>D100</CourseChip>
                    <span className="shrink-0 font-medium whitespace-nowrap">CMPT 225</span>
                    <span className="min-w-0 truncate text-muted-foreground">
                        Data Structures and Programming
                    </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                    Burnaby · 118/120 enrolled · 6 waiting
                </p>
                <div className="mt-3">
                    <CapacityBar enrolled={118} capacity={120} waitlist={6} />
                </div>
                <div className="mt-3 flex items-baseline gap-3 rounded-lg bg-muted/40 px-3 py-2.5">
                    <span className="text-xs text-muted-foreground">
                        Notify when waitlist drops from
                    </span>
                    <span className="font-mono text-sm tabular-nums">
                        <span className="text-muted-foreground">6</span>
                        <span className="mx-1.5 text-muted-foreground/50">→</span>
                        <span className="font-semibold">3</span>
                    </span>
                </div>
            </div>
            <p className="mt-3 px-1 text-xs leading-relaxed text-muted-foreground">
                One watch: when the queue thins out, one email goes to your inbox — then
                the watch is done.
            </p>
        </div>
    </section>
);

export default LandingHero;
