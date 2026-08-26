const steps = [
    {
        n: "1",
        title: "Sign in with your email",
        body: "A code lands in your inbox — no password to invent. We never ask for your goSFU login.",
    },
    {
        n: "2",
        title: "Pick your sections",
        body: "Watch as many as you want. For each one, choose what counts as good news: a seat available, or the waitlist thinning out.",
    },
    {
        n: "3",
        title: "Get one email",
        body: "When it happens, one email goes out and the watch is done. You go swap your waitlist or enroll on goSFU.",
    },
];

const HowItWorks = () => (
    <section id="how" className="scroll-mt-16 border-t border-border/60">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
            <ol className="mt-8 grid gap-8 sm:grid-cols-3">
                {steps.map((step) => (
                    <li key={step.n}>
                        <span className="font-mono text-xs font-semibold text-brand">
                            {step.n}
                        </span>
                        <h3 className="mt-2 text-sm font-medium">{step.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            {step.body}
                        </p>
                    </li>
                ))}
            </ol>
        </div>
    </section>
);

export default HowItWorks;
