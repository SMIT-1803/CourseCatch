// Shared presentation helpers for the add dialog and the watch list.
// The server action keeps its own copy of the threshold rule — it is the
// authority; these exist so the two client surfaces can't drift from each other.

export const formatObserved = (iso: string) =>
    new Intl.DateTimeFormat("en-CA", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Vancouver",
        timeZoneName: "short",
    }).format(new Date(iso));

export const validateThreshold = (value: string, waitlist: number): string | null => {
    if (value.trim() === "") return "Enter a number.";
    const t = Number(value);
    if (!Number.isInteger(t)) return "Whole numbers only.";
    if (t < 1) return "Must be at least 1.";
    if (waitlist < t) return `Already below ${t} — currently ${waitlist} waiting.`;
    return null;
};
