import Wordmark from "@/components/wordmark";

const LandingFooter = () => (
    <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-8 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
            <Wordmark />
            <p className="text-xs leading-relaxed text-muted-foreground">
                Not affiliated with or endorsed by Simon Fraser University.
            </p>
        </div>
    </footer>
);

export default LandingFooter;
