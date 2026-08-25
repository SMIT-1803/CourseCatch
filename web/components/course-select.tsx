"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Course } from "./course-search";
import { hasRoomNow } from "./course-search";
import { addTrigger } from "@/app/actions"

interface CourseSelectProps {
    course: Course | null;
    onClose: () => void;
}

interface ResultFormat {
    condition: string;
    status: "error" | "ok";
    message: string;
};

const formatObserved = (iso: string) =>
    new Intl.DateTimeFormat("en-CA", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Vancouver",
        timeZoneName: "short",
    }).format(new Date(iso));

const CapacityBar = ({
    enrolled,
    capacity,
    waitlist,
}: Pick<Course, "enrolled" | "capacity" | "waitlist">) => {
    const total = Math.max(capacity, enrolled + waitlist);
    const pct = (n: number) => `${(n / total) * 100}%`;
    const free = Math.max(0, capacity - enrolled);

    return (
        <div className="space-y-2">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="bg-foreground/80" style={{ width: pct(enrolled) }} />
                <div className="bg-emerald-500/70" style={{ width: pct(free) }} />
                <div className="bg-amber-500/40" style={{ width: pct(waitlist) }} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs tabular-nums text-muted-foreground">
                <span>
                    <span className="inline-block size-2 translate-y-px rounded-full bg-foreground/80" />{" "}
                    {enrolled} enrolled
                </span>
                <span>
                    <span className="inline-block size-2 translate-y-px rounded-full bg-emerald-500/70" />{" "}
                    {free} free
                </span>
                <span>
                    <span className="inline-block size-2 translate-y-px rounded-full bg-amber-500/40" />{" "}
                    {waitlist} waiting
                </span>
            </div>
        </div>
    );
};

const CourseSelect = ({ course, onClose }: CourseSelectProps) => {
    const [wantOpenSeat, setWantOpenSeat] = useState(false);
    const [wantWaitlist, setWantWaitlist] = useState(false);
    const [threshold, setThreshold] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<ResultFormat[]>([]);
    const [thresholdError, setThresholdError] = useState<string | null>(null)

    // Reset whenever a different section is opened.
    useEffect(() => {
        setWantOpenSeat(false);
        setWantWaitlist(false);
        setThreshold("");
        setResults([]);
        setIsSubmitting(false);
        setThresholdError(null)
    }, [course?.slug]);

    if (!course) return null;

    const roomNow = hasRoomNow(course);
    const canQueue = course.waitlist > 0;
    const nothingChosen = !wantOpenSeat && !wantWaitlist;


    const validateThreshold = (value: string, waitlist: number): string | null => {
        if (value.trim() === "") return "Enter a number.";
        const t = Number(value);
        if (!Number.isInteger(t)) return "Whole numbers only.";
        if (t < 1) return "Must be at least 1.";
        if (waitlist < t) return `Already below ${t} — currently ${waitlist} waiting.`;
        return null;
    };

    const handleSubmit = async () => {
        setResults([])
        const t = Number(threshold);
        if (wantWaitlist) {
            const err = validateThreshold(threshold, course.waitlist);
            if (err) {
                setResults([{ condition: "waitlist_below", status: "error", message: err }]);
                return;
            }
        }
        setIsSubmitting(true)
        try {
            const res: ResultFormat[] = await addTrigger(course.slug, wantOpenSeat, wantWaitlist, t)
            setResults(res)
            if (res.every(r => r.status === "ok")) onClose()
        }
        finally {
            setIsSubmitting(false)
        }

    };

    return (
        <Dialog open={!!course} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-baseline gap-2">
                        <span className="font-mono text-sm font-semibold text-muted-foreground">
                            {course.section}
                        </span>
                        <span>
                            {course.dept} {course.course_code}
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        {course.course_name} · {course.campus}
                        {course.instructor && ` · ${course.instructor}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-4">
                    <div className="flex items-baseline justify-between">
                        <span className="font-mono text-2xl font-semibold tabular-nums">
                            {course.enrolled}
                            <span className="text-muted-foreground">/{course.capacity}</span>
                        </span>
                        {course.waitlist > 0 && (
                            <span className="font-mono text-sm tabular-nums text-muted-foreground">
                                +{course.waitlist} waiting
                            </span>
                        )}
                    </div>
                    <CapacityBar {...course} />
                    <p className="pt-1 text-xs text-muted-foreground">
                        As of {formatObserved(course.observed_at)}
                    </p>
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-medium">Email me when</p>

                    <label
                        htmlFor="cond-open-seat"
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors has-checked:border-foreground/30 has-checked:bg-muted/40"
                    >
                        <Checkbox
                            id="cond-open-seat"
                            checked={wantOpenSeat}
                            disabled={roomNow}
                            onCheckedChange={(c) => setWantOpenSeat(c === true)}
                            className="mt-0.5"
                        />
                        <span className="min-w-0">
                            <span className="block text-sm">A seat is free and nobody&apos;s waiting</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                                {roomNow
                                    ? "This section already has room and no queue — nothing to wait for."
                                    : "Fires when the queue clears and seats remain."}
                            </span>
                        </span>
                    </label>

                    <label
                        htmlFor="cond-waitlist"
                        className={`flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors has-checked:border-foreground/30 has-checked:bg-muted/40 ${canQueue ? "cursor-pointer" : "opacity-60"
                            }`}
                    >
                        <Checkbox
                            id="cond-waitlist"
                            checked={wantWaitlist}
                            disabled={!canQueue}
                            onCheckedChange={(c) => setWantWaitlist(c === true)}
                            className="mt-0.5"
                        />
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm">The waitlist drops below</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                                {canQueue
                                    ? `Currently ${course.waitlist} waiting.`
                                    : "No queue on this section, so there's no threshold to set."}
                            </span>

                            {wantWaitlist && canQueue && (
                                <span className="mt-2 block">
                                    <span className="flex items-baseline gap-2">
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            autoFocus
                                            value={threshold}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setThreshold(value);
                                                setThresholdError(validateThreshold(value, course.waitlist));
                                            }}
                                            placeholder={String(Math.max(1, Math.floor(course.waitlist / 2)))}
                                            aria-invalid={thresholdError !== null}
                                            aria-describedby={`threshold-hint-${course.slug}`}
                                            className="max-w-20 text-center font-mono text-base tabular-nums"
                                        />
                                    </span>

                                    <span
                                        id={`threshold-hint-${course.slug}`}
                                        className={`mt-1.5 block text-xs ${thresholdError ? "text-destructive" : "text-muted-foreground"
                                            }`}
                                    >
                                        {thresholdError ?? `Any number from 1 to ${course.waitlist}.`}
                                    </span>
                                </span>
                            )}
                        </span>
                    </label>
                </div>

                {results.length > 0 && (
                    <div className="space-y-1.5">
                        {results.map((r) => (
                            <p
                                key={r.condition + r.message}
                                className={`rounded-md border px-3 py-2 text-xs ${r.status === "ok"
                                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                                    : "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400"
                                    }`}
                            >
                                {r.message}
                            </p>
                        ))}
                    </div>
                )}

                <p className="text-xs leading-relaxed text-muted-foreground">
                    Seats may be reserved for specific programs, so check goSFU to confirm you can
                    enroll. Not affiliated with or endorsed by Simon Fraser University.
                </p>

                <DialogFooter>
                    <Button
                        type="button"
                        disabled={nothingChosen || isSubmitting || (wantWaitlist && (threshold.trim() === "" || thresholdError !== null))}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Adding…" : "Add alert"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CourseSelect;
