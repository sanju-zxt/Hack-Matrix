import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { InstagramIcon, LinkedinIcon, WhatsappIcon } from "../ui/SocialIcons";
import {
  contact,
  event,
  footer,
  registration,
  scheduleDates,
  venue,
} from "../../data/eventConfig";
import { Container } from "../ui/Section";
import { Brand } from "../ui/Logo";
import { cn } from "../../lib/cn";

const socials = [
  {
    href: contact.instagram,
    label: "Instagram",
    Icon: InstagramIcon,
    show: Boolean(contact.instagram),
  },
  {
    href: contact.linkedin,
    label: "LinkedIn",
    Icon: LinkedinIcon,
    show: Boolean(contact.linkedin),
  },
  {
    href: contact.whatsapp,
    label: "WhatsApp",
    Icon: WhatsappIcon,
    show: Boolean(contact.whatsapp),
  },
].filter((s) => s.show && s.href.length > 0);

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ink-900/40">
      <Container className="footer-shell">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <Brand logoSize={44} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              {event.subtitle} at {event.institution}, {event.city}. {event.tagline}.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/55">
              <span className="inline-flex min-w-0 items-center gap-2">
                <CalendarDays size={15} className="shrink-0 text-violet-bright" />
                <span className="wrap-anywhere">{scheduleDates.dateLabel}</span>
              </span>
              <span className="inline-flex min-w-0 items-center gap-2">
                <MapPin size={15} className="shrink-0 text-violet-bright" />
                <span className="wrap-anywhere">{venue.name}</span>
              </span>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
              Quick Links
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:mt-5 sm:gap-y-3">
              {footer.quickLinks.map((link) => {
                const isHash = link.to.includes("#");
                return (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className={cn(
                        "group inline-flex min-h-11 sm:min-h-0 items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-violet-bright"
                      )}
                    >
                      {link.label}
                      {!isHash && (
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Contact + social */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
              Get in touch
            </h3>
            <ul className="mt-3 space-y-1 text-sm text-white/70 sm:mt-5 sm:space-y-3">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex min-h-11 sm:min-h-0 items-center gap-2.5 transition-colors hover:text-violet-bright"
                >
                  <Mail size={15} className="mt-0.5 shrink-0 text-violet-bright" />
                  <span className="wrap-anywhere min-w-0">{contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                  className="flex min-h-11 sm:min-h-0 items-center gap-2.5 transition-colors hover:text-violet-bright"
                >
                  <Phone size={15} className="mt-0.5 shrink-0 text-violet-bright" />
                  <span className="wrap-anywhere min-w-0">{contact.phone}</span>
                </a>
              </li>
              <li className="flex min-h-11 sm:min-h-0 items-center gap-2.5 text-white/55">
                <MapPin size={15} className="mt-0.5 shrink-0 text-violet-bright" />
                <span className="wrap-anywhere min-w-0">{venue.addressLine1}</span>
              </li>
            </ul>

            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet/50 hover:text-violet-bright"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-white/60 sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:pt-7">
          <p>
            © {new Date().getFullYear()} {event.name}. All rights reserved.
          </p>
          <p className="font-mono tracking-wide">
            {event.name} {event.edition} · {registration.teamSize.label}
          </p>
        </div>
      </Container>
    </footer>
  );
}
