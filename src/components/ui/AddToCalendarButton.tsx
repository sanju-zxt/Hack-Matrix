import { useRef } from "react";
import { Calendar } from "lucide-react";
import { event, scheduleDates, venue } from "../../data/eventConfig";
import { getRegistrationUrl } from "../../lib/registration";
import { cn } from "../../lib/cn";

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toIcsDateTime(value: Date) {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function buildIcs() {
  const start = new Date(
    `${scheduleDates.dateISO}T${scheduleDates.startTime}:00${scheduleDates.timeZoneOffset}`,
  );
  const end = new Date(
    `${scheduleDates.dateISO}T${scheduleDates.endTime}:00${scheduleDates.timeZoneOffset}`,
  );
  const registrationUrl = getRegistrationUrl();
  const description = [
    event.subtitle,
    event.heroDescription,
    registrationUrl ? `Register: ${registrationUrl}` : "",
  ]
    .filter(Boolean)
    .join(" — ");
  const location = [venue.name, venue.addressLine1].filter(Boolean).join(", ");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HACKMATRIX//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@hackmatrix`,
    `DTSTAMP:${toIcsDateTime(new Date())}`,
    `DTSTART:${toIcsDateTime(start)}`,
    `DTEND:${toIcsDateTime(end)}`,
    `SUMMARY:${escapeIcs(event.displayName)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function AddToCalendarButton({ className }: { className?: string }) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const busy = useRef(false);

  const handleDownload = () => {
    const anchor = anchorRef.current;
    if (!anchor || busy.current) return;
    busy.current = true;
    anchor.href = URL.createObjectURL(new Blob([buildIcs()], { type: "text/calendar" }));
    anchor.click();
    window.setTimeout(() => {
      URL.revokeObjectURL(anchor.href);
      anchor.removeAttribute("href");
      busy.current = false;
    });
  };

  return (
    <a
      ref={anchorRef}
      download="hack-matrix-2026.ics"
      onClick={handleDownload}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-bright select-none",
        "text-white border border-white/15 bg-white/[0.02] hover:border-violet/60 hover:bg-violet/10 hover:text-violet-bright",
        "px-6 py-3",
        className,
      )}
    >
      <Calendar
        size={16}
        strokeWidth={2}
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      />
      ADD TO CALENDAR
    </a>
  );
}