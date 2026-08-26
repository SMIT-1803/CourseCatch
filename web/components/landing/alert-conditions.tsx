import CapacityBar from "@/components/capacity-bar";

const AlertConditions = () => (
    <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight">
                Demo
            </h2>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                Every watch is one condition on one section. You pick it when you add
                the watch.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-card p-5">
                    <h3 className="text-sm font-medium">A seat is free and nobody&apos;s waiting</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                        enrolled &lt; capacity · waitlist = 0
                    </p>
                    <div className="mt-4">
                        <CapacityBar enrolled={96} capacity={120} waitlist={0} />
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                        Free seats alongside a queue don&apos;t count — that&apos;s usually
                        capacity reserved for specific programs, and the queue moves first.
                        This fires only when the queue clears and seats remain.
                    </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-card p-5">
                    <h3 className="text-sm font-medium">The waitlist drops below your number</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                        waitlist &lt; N · you pick N
                    </p>
                    <div className="mt-4">
                        <CapacityBar enrolled={120} capacity={120} waitlist={4} />
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                        Watching a full section? Set a threshold and hear about it the day
                        the queue gets short enough to be worth joining with one of your two
                        goSFU slots.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default AlertConditions;
