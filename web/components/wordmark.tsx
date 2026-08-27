import { cn } from "@/lib/utils";

interface WordmarkProps {
    className?: string;
}

/**
 * The mark: a bold C — the catcher — with a seat-dot landing in its mouth.
 * The C inherits the text color; the dot is always brand emerald.
 */
const Wordmark = ({ className }: WordmarkProps) => (
    <span className={cn("flex items-center gap-2", className)}>
        <svg
            viewBox="0 0 32 32"
            className="size-6 shrink-0"
            aria-hidden="true"
        >
            <path
                d="M19.59 9.45 A 8 8 0 1 0 19.59 22.55"
                fill="none"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
            />
            <circle cx="23.2" cy="16" r="3.4" className="fill-brand" />
        </svg>
        <span className="text-lg font-semibold tracking-tight">CourseCatch</span>
    </span>
);

export default Wordmark;
