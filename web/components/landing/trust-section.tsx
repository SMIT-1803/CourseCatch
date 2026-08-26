const points = [
    {
        title: "Your email, nothing else",
        body: "No name, student number, program, or grades. And never your goSFU password — CourseCatch doesn't touch goSFU at all.",
    },
    {
        title: "Read-only, in the open",
        body: "Enrollment data is refreshed once daily from Coursys. CourseCatch only reads publicly visible figures and reports what it sees.",
    },
    {
        title: "One email, then done",
        body: "A watch fires once and retires itself. No streaks, no digests, no reminders. You can delete any watch yourself, anytime.",
    },
    {
        title: "No seat promises",
        body: "Seats may be reserved for specific programs, so check goSFU to confirm you can enroll. CourseCatch tells you when to look — it never claims a seat is yours.",
    },
];

const TrustSection = () => (
    <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight">
                What it does — and won&apos;t
            </h2>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                Not affiliated with or endorsed by Simon Fraser University. Built by a
                student, for the ten days a semester when waitlists matter.
            </p>
            <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {points.map((point) => (
                    <div key={point.title}>
                        <dt className="text-sm font-medium">{point.title}</dt>
                        <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            {point.body}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    </section>
);

export default TrustSection;
