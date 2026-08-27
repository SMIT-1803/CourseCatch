import { Button } from "@/components/ui/button";
import Wordmark from "@/components/wordmark";
import { signOut } from "@/app/actions";

interface SiteHeaderProps {
    email: string;
}

const SiteHeader = ({ email }: SiteHeaderProps) => (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl  items-center justify-between gap-3 px-4 sm:px-8">
            <Wordmark />
            <div className="flex min-w-0 items-center gap-1">
                <span className="max-w-[40vw] truncate text-sm text-muted-foreground">
                    Signed in as {email}
                </span>
                <form action={signOut}>
                    <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                    >
                        Sign out
                    </Button>
                </form>
            </div>
        </div>
    </header>
);

export default SiteHeader;
