import SignInForm from "@/components/sign-in-form";
import Wordmark from "@/components/wordmark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LandingHero from "./landing-hero";
import HowItWorks from "./how-it-works";
import AlertConditions from "./alert-conditions";
import LiveWindow from "./live-window";
import TrustSection from "./trust-section";
import LandingFooter from "./landing-footer";

const LandingPage = () => (
    <div className="flex min-h-svh flex-col">
        <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
                <Wordmark />
                <a
                    href="#signin"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                    Sign in
                </a>
            </div>
        </header>

        <main className="flex-1">
            <LandingHero />
            <HowItWorks />
            <AlertConditions />
            <LiveWindow />
            <TrustSection />

            <section id="signin" className="scroll-mt-16 border-t border-border/60">
                <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
                    <div className="mx-auto max-w-sm rounded-xl border border-border/60 bg-card p-6">
                        <h2 className="text-lg font-semibold tracking-tight">
                            Start watching
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Sign in with your email — we&apos;ll send you a code.
                        </p>
                        <div className="mt-5">
                            <SignInForm />
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <LandingFooter />
    </div>
);

export default LandingPage;
