"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon, TrashIcon, XIcon, CheckIcon } from "lucide-react";
import { deleteTrigger, updateThreshold } from "@/app/actions"

export interface Watch {
    id: number;
    condition: string;
    threshold: number | null;
    created_at: string;
    courses_database: {
        slug: string;
        dept: string;
        course_code: string;
        section: string;
        course_name: string;
        campus: string;
        enrolled: number;
        capacity: number;
        waitlist: number;
        observed_at: string;
    };
}

interface WatchListProps {
    triggers: Watch[];
}

interface RowMessage {
    status: "ok" | "error";
    message: string;
}

const formatObserved = (iso: string) =>
    new Intl.DateTimeFormat("en-CA", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Vancouver",
        timeZoneName: "short",
    }).format(new Date(iso));

// Same rule as the add dialog and the server action. Worth extracting to a
// shared module — it currently lives in three places.
const validateThreshold = (value: string, waitlist: number): string | null => {
    if (value.trim() === "") return "Enter a number.";
    const t = Number(value);
    if (!Number.isInteger(t)) return "Whole numbers only.";
    if (t < 1) return "Must be at least 1.";
    if (waitlist < t) return `Already below ${t} — currently ${waitlist} waiting.`;
    return null;
};

const WatchList = ({ triggers }: WatchListProps) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");
    const [editError, setEditError] = useState<string | null>(null);
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Record<number, RowMessage>>({});

    const startEdit = (watch: Watch) => {
        setEditingId(watch.id);
        setEditValue(String(watch.threshold ?? ""));
        setEditError(null);
        setMessages((m) => {
            const next = { ...m };
            delete next[watch.id];
            return next;
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue("");
        setEditError(null);
    };

    const handleSaveThreshold = async (watch: Watch) => {
        const err = validateThreshold(editValue, watch.courses_database.waitlist);
        if (err) {
            setEditError(err);
            return;
        }
        setPendingId(watch.id);
        try {
            const res = await updateThreshold(watch.id, Number(editValue));
            setMessages((m) => ({
                ...m,
                [watch.id]: { status: res[0].status, message: res[0].message },
            }));
            if (res[0].status === "ok") {
                cancelEdit();
            }
        } finally {
            setPendingId(null);
        }
    };

    const handleDelete = async (watch: Watch) => {
        setPendingId(watch.id);
        try {
            const res = await deleteTrigger(watch.id);
            if (res[0].status === "error") {
                setMessages((m) => ({
                    ...m,
                    [watch.id]: { status: "error", message: res[0].message },
                }));
            }
        } finally {
            setPendingId(null);
        }
    };

    if (triggers.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border/60 px-6 py-10 text-center">
                <p className="text-sm font-medium">You&apos;re not watching anything yet</p>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                    Find a section below and pick what you want to hear about. You&apos;ll get
                    one email when it happens — up to twelve sections at a time.
                </p>
            </div>
        );
    }

    return (
        <section className="space-y-3">
            <header className="flex items-baseline justify-between px-1">
                <h2 className="text-sm font-medium">Watching</h2>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {triggers.length}/12
                </span>
            </header>

            <ul className="space-y-2">
                {triggers.map((watch) => {
                    const c = watch.courses_database;
                    const isEditing = editingId === watch.id;
                    const isPending = pendingId === watch.id;
                    const msg = messages[watch.id];
                    const isWaitlistWatch = watch.condition === "waitlist_below";

                    return (
                        <li
                            key={watch.id}
                            className="rounded-xl border border-border/60 bg-card p-4"
                        >
                            <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
                                {/* identity */}
                                <div className="min-w-0 flex-1">
                                    <p className="flex items-baseline gap-2 text-sm">
                                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                                            {c.section}
                                        </span>
                                        <span className="font-medium">
                                            {c.dept} {c.course_code}
                                        </span>
                                        <span className="truncate text-muted-foreground">
                                            {c.course_name}
                                        </span>
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {c.campus} · {c.enrolled}/{c.capacity} enrolled ·{" "}
                                        {c.waitlist} waiting
                                    </p>
                                </div>

                                {/* actions */}
                                <div className="flex shrink-0 items-center gap-1">
                                    {isWaitlistWatch && !isEditing && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => startEdit(watch)}
                                            disabled={isPending}
                                            aria-label="Change threshold"
                                        >
                                            <PencilIcon />
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => handleDelete(watch)}
                                        disabled={isPending}
                                        aria-label={`Stop watching ${c.dept} ${c.course_code} ${c.section}`}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <TrashIcon />
                                    </Button>
                                </div>
                            </div>

                            {/* the condition — what you're actually waiting for */}
                            <div className="mt-3 rounded-lg bg-muted/40 px-3 py-2.5">
                                {isWaitlistWatch ? (
                                    isEditing ? (
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs text-muted-foreground">
                                                    Email me when the queue drops below
                                                </span>
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    autoFocus
                                                    value={editValue}
                                                    onChange={(e) => {
                                                        setEditValue(e.target.value);
                                                        setEditError(
                                                            validateThreshold(e.target.value, c.waitlist)
                                                        );
                                                    }}
                                                    aria-invalid={editError !== null}
                                                    className="h-8 max-w-20 text-center font-mono tabular-nums"
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon-sm"
                                                    onClick={() => handleSaveThreshold(watch)}
                                                    disabled={
                                                        isPending ||
                                                        editValue.trim() === "" ||
                                                        editError !== null
                                                    }
                                                    aria-label="Save threshold"
                                                >
                                                    <CheckIcon />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={cancelEdit}
                                                    disabled={isPending}
                                                    aria-label="Cancel"
                                                >
                                                    <XIcon />
                                                </Button>
                                            </div>
                                            <p
                                                className={`text-xs ${editError ? "text-destructive" : "text-muted-foreground"
                                                    }`}
                                            >
                                                {editError ?? `Any number from 1 to ${c.waitlist}.`}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-xs text-muted-foreground">
                                                Queue drops below
                                            </span>
                                            {/* where you are, and where it needs to get to */}
                                            <span className="font-mono text-sm tabular-nums">
                                                <span className="text-muted-foreground">{c.waitlist}</span>
                                                <span className="mx-1.5 text-muted-foreground/50">→</span>
                                                <span className="font-semibold">{watch.threshold}</span>
                                            </span>
                                        </div>
                                    )
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        A seat is free and nobody&apos;s waiting
                                        {c.waitlist > 0 && (
                                            <span className="ml-1.5 font-mono tabular-nums">
                                                — {c.waitlist} ahead of you now
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>

                            <p className="mt-2 text-xs text-muted-foreground">
                                As of {formatObserved(c.observed_at)}
                            </p>

                            {msg && (
                                <p
                                    className={`mt-2 rounded-md border px-3 py-2 text-xs ${msg.status === "ok"
                                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                                        : "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400"
                                        }`}
                                >
                                    {msg.message}
                                </p>
                            )}
                        </li>
                    );
                })}
            </ul>

            <p className="px-1 text-xs text-muted-foreground">
                Enrollment data is refreshed once daily from Coursys. Seats may be reserved
                for specific programs — check goSFU to confirm you can enroll.
            </p>
        </section>
    );
};

export default WatchList;