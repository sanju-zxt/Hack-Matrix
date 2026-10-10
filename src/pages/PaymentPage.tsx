import {
  BadgeCheck,
  Clock,
  ExternalLink,
  Info,
  ListChecks,
  Mail,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { contact, event, payment } from "../data/eventConfig";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { Reveal } from "../components/ui/Reveal";

const isLive = payment.status === "live";

export default function PaymentPage() {
  usePageMeta({
    title: "Payment",
    description: isLive
      ? `Pay the ${payment.fee} ${payment.feePer} IGNITE 2026 registration fee securely through Razorpay and confirm your team's slot.`
      : "Payment details for IGNITE 2026 are yet to be updated. The registration fee, and secure payment link will be published here once confirmed.",
    canonicalPath: "/payment",
  });

  if (!isLive) {
    return (
      <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20">
        <Container className="relative">
          <Reveal>
            <p className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.25em] text-amber-300 sm:text-xs">
              <Clock size={13} strokeWidth={2} className="shrink-0" aria-hidden />
              PAYMENT DETAILS YET TO BE UPDATED
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-center font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Payment is{" "}
              <span className="text-gradient">yet to be updated</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-2xl break-words text-center text-base leading-relaxed text-white/60 sm:text-lg">
              {payment.message}
            </p>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20">
      <Container className="relative">
        <Reveal>
          <p className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.25em] text-emerald-300 sm:text-xs">
            <BadgeCheck size={13} strokeWidth={2} className="shrink-0" aria-hidden />
            {payment.notice}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="text-center font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Pay <span className="text-gradient">{payment.fee}</span> &amp; confirm
            your team
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-2xl break-words text-center text-base leading-relaxed text-white/60 sm:text-lg">
            {payment.message}
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-2">
          <Reveal className="min-w-0">
            <div className="glass h-full rounded-2xl p-5 sm:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-violet/20 bg-violet/10 text-violet-bright">
                <ListChecks size={18} strokeWidth={1.75} aria-hidden />
              </span>
              <h2 className="mt-4 break-words font-display text-xl font-semibold text-white sm:text-2xl">
                How payment works
              </h2>
              <ol className="mt-6 space-y-3">
                {payment.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex min-w-7 shrink-0 items-center justify-center rounded-md border border-violet/30 bg-violet/10 px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold text-violet-bright">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="break-words text-sm leading-relaxed text-white/80">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal className="min-w-0" delay={0.05}>
            <div className="glass-strong h-full rounded-2xl p-5 sm:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <Wallet size={18} strokeWidth={1.75} aria-hidden />
              </span>
              <h2 className="mt-4 break-words font-display text-xl font-semibold text-white sm:text-2xl">
                Registration fee
              </h2>
              <div className="mt-4 flex flex-wrap items-end gap-2">
                <span className="break-words font-display text-4xl font-bold text-white sm:text-5xl">
                  {payment.fee}
                </span>
                <span className="pb-1 text-sm text-white/60">{payment.feePer}</span>
              </div>
              <p className="mt-3 break-words text-sm leading-relaxed text-white/55">
                One-time fee for the full 4-week sprint — split however your team
                likes. Non-refundable.
              </p>

              <div className="mt-6 border-t border-white/10 pt-6">
                <Button
                  href={payment.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  PAY {payment.fee} NOW
                  <ExternalLink size={16} strokeWidth={2} aria-hidden />
                </Button>
                <p className="mt-3 break-words text-xs leading-relaxed text-white/50">
                  Opens the secure {payment.provider} payment page
                  ({payment.handle}) in a new tab. Pay by UPI, card or net
                  banking.
                </p>
              </div>

              <a
                href={`mailto:${contact.email}`}
                className="mt-5 inline-flex items-center gap-2 break-all rounded-md text-sm font-semibold text-violet-bright underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-bright"
              >
                <Mail size={15} strokeWidth={1.75} className="shrink-0" aria-hidden />
                Questions? Email {contact.email}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="glass mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 rounded-2xl p-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <ShieldCheck size={16} strokeWidth={1.75} aria-hidden />
              </span>
              <p className="min-w-0 break-words text-sm leading-relaxed text-white/60">
                Payments are handled on {payment.provider}&apos;s secure page. We
                never see or store your UPI, card or net-banking credentials.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet/20 bg-violet/10 text-violet-bright">
                <Info size={16} strokeWidth={1.75} aria-hidden />
              </span>
              <p className="min-w-0 break-words text-sm leading-relaxed text-white/60">
                The fee is non-refundable — see the{" "}
                <Link
                  to="/legal/refund-cancellation"
                  className="font-semibold text-violet-bright underline-offset-4 transition-colors hover:underline"
                >
                  Refund &amp; Cancellation Policy
                </Link>
                . {event.name} {event.edition} is organised by VVIT and partners.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
