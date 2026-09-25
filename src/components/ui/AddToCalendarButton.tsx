import { useEffect, useRef, type MouseEvent } from "react";
import { Calendar } from "lucide-react";
import { event, scheduleDates, venue } from "../../data/eventConfig";
import { getRegistrationUrl } from "../../lib/registration";
import { cn } from "../../lib/cn";

const EVENT_UID = "hack-matrix-2026@hackmatrix";
const OBJECT_URL_REVOKE_DELAY = 2000;
const textEncoder = new TextEncoder();

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function foldIcsLine(line: string) {
  const chunks: string[] = [];
  let current = "";
  let currentBytes = 0;

  for (const character of line) {
    const characterBytes = textEncoder.encode(character).byteLength;
    const limit = chunks.length === 0 ? 75 : 74;
    if (current && currentBytes + characterBytes > limit) {
      chunks.push(current);
      current = character;
      currentBytes = characterBytes;
    } else {
      current += character;
      currentBytes += characterBytes;
    }
  }

  if (current || chunks.length === 0) chunks.push(current);
  return chunks.join("\r\n ");
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
    `UID:${EVENT_UID}`,
    `DTSTAMP:${toIcsDateTime(new Date())}`,
    `DTSTART:${toIcsDateTime(start)}`,
    `DTEND:${toIcsDateTime(end)}`,
    `SUMMARY:${escapeIcs(event.displayName)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldIcsLine).join("\r\n");
}

export function AddToCalendarButton({ className }: { className?: string }) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const revokeTimerRef = useRef<number | null>(null);
  const busy = useRef(false);
  const activating = useRef(false);

  const ensureObjectUrl = () => {
    if (!objectUrlRef.current) {
      objectUrlRef.current = URL.createObjectURL(
        new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" }),
      );
    }
    return objectUrlRef.current;
  };

  const revokeObjectUrl = (url: string) => {
    URL.revokeObjectURL(url);
    if (objectUrlRef.current === url) objectUrlRef.current = null;
    if (anchorRef.current?.getAttribute("href") === url) {
      anchorRef.current.removeAttribute("href");
    }
  };

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    if (revokeTimerRef.current !== null) {
      window.clearTimeout(revokeTimerRef.current);
      revokeTimerRef.current = null;
    }

    const url = ensureObjectUrl();
    anchor.href = url;

    return () => {
      if (revokeTimerRef.current !== null) {
        window.clearTimeout(revokeTimerRef.current);
        revokeTimerRef.current = null;
      }
      const urlToRevoke = objectUrlRef.current;
      if (urlToRevoke) {
        revokeTimerRef.current = window.setTimeout(() => {
          revokeObjectUrl(urlToRevoke);
          revokeTimerRef.current = null;
        }, OBJECT_URL_REVOKE_DELAY);
      }
    };
  }, []);

  const handleDownload = (event: MouseEvent<HTMLAnchorElement>) => {
    const anchor = event.currentTarget;
    if (!anchor || busy.current) return;

    const hadHref = Boolean(anchor.getAttribute("href"));
    const url = ensureObjectUrl();
    if (!url) return;
    if (anchor.getAttribute("href") !== url) anchor.href = url;

    if (!hadHref && !activating.current) {
      event.preventDefault();
      activating.current = true;
      anchor.click();
      activating.current = false;
      return;
    }

    busy.current = true;
    if (revokeTimerRef.current !== null) {
      window.clearTimeout(revokeTimerRef.current);
      revokeTimerRef.current = null;
    }
    revokeTimerRef.current = window.setTimeout(() => {
      revokeObjectUrl(url);
      revokeTimerRef.current = null;
      busy.current = false;
    }, OBJECT_URL_REVOKE_DELAY);
  };

  return (
    <a
      ref={anchorRef}
      role="button"
      tabIndex={0}
      download="hack-matrix-2026.ics"
      onClick={handleDownload}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.currentTarget.click();
      }}
      className={cn(
        "group inline-flex min-h-11 max-w-full items-center justify-center gap-2 whitespace-normal break-words rounded-full text-center text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-bright select-none",
        "text-white border border-white/15 bg-white/[0.02] hover:border-violet/60 hover:bg-violet/10 hover:text-violet-bright",
        "px-4 py-3 sm:px-6",
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