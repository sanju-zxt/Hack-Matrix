import { lazy, Suspense, type FormEvent } from "react";
import { ArrowUpRight, Mail, MapPin, Phone, Send } from "lucide-react";
import { contact, event, venue } from "../../data/eventConfig";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import {
  DiscordIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "../ui/SocialIcons";

const ContactMap = lazy(() => import("./ContactMap"));

const socials = [
  { href: contact.instagram, label: "Instagram", Icon: InstagramIcon, show: Boolean(contact.instagram) },
  { href: contact.linkedin, label: "LinkedIn", Icon: LinkedinIcon, show: Boolean(contact.linkedin) },
  { href: contact.whatsapp, label: "WhatsApp", Icon: WhatsappIcon, show: Boolean(contact.whatsapp) },
  { href: contact.discord, label: "Discord", Icon: DiscordIcon, show: Boolean(contact.discord) },
].filter((s) => s.show && s.href.length > 0);

const inputClass =
  "min-h-11 w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-base text-white placeholder:text-white/60 focus:border-violet focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

const defaultSubject = `${event.name} ${event.edition} enquiry`;

function cleanSingleLine(value: FormDataEntryValue | null, maxLength: number) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function getContactEmail() {
  const email = contact.email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function buildMailto(form: HTMLFormElement) {
  const recipient = getContactEmail();
  if (!recipient) return "";

  const data = new FormData(form);
  const subject = cleanSingleLine(data.get("subject"), 120) || defaultSubject;
  const message = String(data.get("message") ?? "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, 5000);
  const body = [
    cleanSingleLine(data.get("name"), 120),
    cleanSingleLine(data.get("email"), 254),
    cleanSingleLine(data.get("phone"), 40),
    "",
    message,
  ]
    .filter((line) => line.length > 0)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  return `mailto:${recipient}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

export function Contact() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mailto = buildMailto(e.currentTarget);
    if (mailto) window.location.href = mailto;
  };

  return (
    <Section id="contact">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Contact channels */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="Contact"
              title="Talk to the organizing team"
              className="mb-6 sm:mb-8"
            />

            <div className="space-y-4">
              <Reveal delay={0.05} y={16}>
                <a
                  href={`mailto:${getContactEmail()}`}
                  className="group flex min-h-11 items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-violet/40 hover:bg-violet/5 sm:gap-4 sm:p-5"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet-bright transition-colors duration-300 group-hover:bg-violet/20">
                    <Mail size={19} strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55">
                      Email
                    </span>
                    <span className="block break-all font-medium text-white transition-colors group-hover:text-violet-bright">
                      {contact.email}
                    </span>
                  </span>
                </a>
              </Reveal>

              <Reveal delay={0.1} y={16}>
                <a
                  href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                  className="group flex min-h-11 items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-violet/40 hover:bg-violet/5 sm:gap-4 sm:p-5"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet-bright transition-colors duration-300 group-hover:bg-violet/20">
                    <Phone size={19} strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55">
                      Phone
                    </span>
                    <span className="block break-all font-medium text-white transition-colors group-hover:text-violet-bright">
                      {contact.phone}
                    </span>
                  </span>
                </a>
              </Reveal>

              <Reveal delay={0.15} y={16}>
                <div className="flex min-h-11 items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:gap-4 sm:p-5">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet-bright">
                    <MapPin size={19} strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55">
                      Venue
                    </span>
                    <span className="block break-words font-medium text-white">
                      {venue.name}
                    </span>
                    <span className="block break-words text-sm text-white/60">
                      {venue.addressLine1}
                    </span>
                  </span>
                </div>
              </Reveal>

              {socials.length > 0 && (
                <Reveal delay={0.2} y={16}>
                  <div className="flex flex-wrap items-center gap-3">
                    {socials.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="inline-flex h-11 w-11 min-h-11 sm:h-10 sm:w-10 sm:min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet/50 hover:text-violet-bright"
                      >
                        <Icon size={17} />
                      </a>
                    ))}
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.25} y={16}>
                <Button
                  variant="outline"
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  View on Google Maps
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  />
                </Button>
              </Reveal>
            </div>
          </div>

          {/* Message form */}
          <Reveal delay={0.1} y={24}>
            <div className="glass rounded-3xl p-5 sm:p-8">
              <h3 className="font-display text-lg font-semibold text-white">
                Send a message
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Your email app opens with everything pre-filled — just hit send.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4 sm:mt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-sm font-medium text-white/70"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      required
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-sm font-medium text-white/70"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-1.5 block text-sm font-medium text-white/70"
                  >
                    Phone <span className="text-white/55">(optional)</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={40}
                    placeholder="+91 …"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-1.5 block text-sm font-medium text-white/70"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    defaultValue={defaultSubject}
                    maxLength={120}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-sm font-medium text-white/70"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    maxLength={5000}
                    placeholder="Tell us how we can help…"
                    className={cn(inputClass, "min-h-32 resize-y")}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Send message
                  <Send size={17} />
                </Button>
                <p className="break-words text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/55">
                  Opens your email app — no data is stored.
                </p>
              </form>
            </div>
          </Reveal>
        </div>

        {/* Lazy-loaded campus map */}
        <Reveal delay={0.1} y={20}>
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 sm:mt-12">
            <Suspense
              fallback={
                <div className="glass flex min-h-64 max-h-[26rem] aspect-[16/9] sm:h-72 w-full items-center justify-center text-sm text-white/60">
                  Loading map…
                </div>
              }
            >
              <ContactMap />
            </Suspense>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}