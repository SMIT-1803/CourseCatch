import CourseChip from "@/components/course-chip";

const LiveWindow = () => (
    <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <div className="flex items-center gap-2">
                    <span className="ml-1 font-mono text-sm tabular-nums text-muted-foreground">
                        Till
                    </span>
                    <CourseChip className="px-2 py-1 text-sm">Sep 18</CourseChip>
                    <span className="ml-1 font-mono text-sm tabular-nums text-muted-foreground">
                        2026
                    </span>
                </div>
                <div className="min-w-64 flex-1">
                    <h2 className="text-sm font-medium">Live for Fall add/drop</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        Watches run during SFU&apos;s add/drop period, while enrollment
                        still moves. When waitlists freeze on the 18th September, there&apos;s nothing
                        left to catch — so CourseCatch stops watching too.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default LiveWindow;
