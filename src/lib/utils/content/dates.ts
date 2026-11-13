import type { Span } from "@/lib/types/content";

const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

/** "2024-06" becomes a month count since year 0, so spans can be compared. */
const toIndex = (month: string) => {
    const [year, number] = month.split("-").map(Number);
    return year * 12 + (number - 1);
};

const formatMonth = (month: string) => {
    const [year, number] = month.split("-");
    return `${MONTHS[Number(number) - 1]} ${year}`;
};

/** "Jun 2024 — Sep 2025", or "Aug 2026 — Present". */
const formatPeriod = ({ start, end }: Span) =>
    `${formatMonth(start)} — ${end ? formatMonth(end) : "Present"}`;

/**
 * Whole months covered by the spans, counting both end months and counting
 * any overlap once. `now` stands in for "Present".
 */
const monthsCovered = (spans: Span[], now: Date) => {
    const current = now.getFullYear() * 12 + now.getMonth();
    const ranges = spans
        .map((span) => ({
            from: toIndex(span.start),
            to: span.end ? toIndex(span.end) : current,
        }))
        .sort((a, b) => a.from - b.from);

    let total = 0;
    let coveredUntil = -Infinity;
    for (const { from, to } of ranges) {
        const begin = Math.max(from, coveredUntil + 1);
        if (to >= begin) total += to - begin + 1;
        coveredUntil = Math.max(coveredUntil, to);
    }
    return total;
};

const plural = (count: number, unit: string) =>
    `${count} ${unit}${count === 1 ? "" : "s"}`;

/** "2 yrs 6 mos", "1 yr", "7 mos". */
const formatDuration = (months: number) => {
    const years = Math.floor(months / 12);
    const rest = months % 12;
    return [
        years > 0 && plural(years, "yr"),
        (rest > 0 || years === 0) && plural(rest, "mo"),
    ]
        .filter(Boolean)
        .join(" ");
};

export { formatDuration, formatPeriod, monthsCovered };
