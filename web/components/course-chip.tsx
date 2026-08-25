import { cn } from "@/lib/utils";

interface CourseChipProps {
    children: React.ReactNode;
    className?: string;
}

const CourseChip = ({ children, className }: CourseChipProps) => (
    <span
        className={cn(
            "inline-flex items-center rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-xs font-semibold tracking-tight",
            className
        )}
    >
        {children}
    </span>
);

export default CourseChip;
