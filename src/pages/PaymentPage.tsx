import { Bell, Clock, Info, ListChecks, Mail, Wallet } from "lucide-react";
import { contact, event, payment } from "../data/eventConfig";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
import { Reveal } from "../components/ui/Reveal";

export default function PaymentPage() {
  usePageMeta({
    title: "Payment",
    description:
      "Payment details for IGNITE 2026 are yet to be updated. The registration fee, UPI / bank details and secure payment link will be published here once confirmed.",
    canonicalPath: "/payment",
  });

  return (
    <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20">
      <Container className="relative">
        <Reveal>
          <p className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.25em] text-amber-300 sm:text-xs">
            <Clock size={13} strokeWidth={2} className="shrink-0" aria-hidden />
            {payment.notice}
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

        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-2">
          <Reveal className="min-w-0">
            <div className="glass h-full rounded-2xl p-5 sm:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-violet/20 bg-violet/10 text-violet-bright">
                <ListChecks size={18} strokeWidth={1.75} aria-hidden />
              </span>
              <h2 className="mt-4 break-words font-display text-xl font-semibold text-white sm:text-2xl">
                What will appear here
              </h2>
              <p className="mt-2 break-words text-sm leading-relaxed text-white/55">
                Once the organizing team finalises the payment process, this page
                will be completed with:
              </p>
              <ol className="mt-6 space-y-3">
                {payment.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex min-w-7 shrink-0 items-center justify-center rounded-md border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold text-amber-300">
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
            <div className="glass h-full rounded-2xl p-5 sm:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-violet/20 bg-violet/10 text-violet-bright">
                <Wallet size={18} strokeWidth={1.75} aria-hidden />
              </span>
              <h2 className="mt-4 break-words font-display text-xl font-semibold text-white sm:text-2xl">
                Registration fee
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="break-words font-display text-3xl font-bold text-white sm:text-4xl">
                  {payment.fee}
                </span>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-amber-300">
                  TBA
                </span>
              </div>
              <p className="mt-3 break-words text-sm leading-relaxed text-white/55">
                The official amount will be confirmed before payments open.
              </p>

              <div className="mt-6 border-t border-white/10 pt-6">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  aria-describedby="notify-note"
                  className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-semibold tracking-wide text-white/45 sm:w-auto"
                >
                  <Bell size={16} strokeWidth={1.75} aria-hidden />
                  NOTIFY ME WHEN LIVE
                </button>
                <p
                  id="notify-note"
                  className="mt-3 break-words text-xs leading-relaxed text-white/50"
                >
                  Notifications aren't available yet. This button will activate
                  once the payment details are published.
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
          <div className="glass mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl p-5 sm:mt-12 sm:p-6">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet/20 bg-violet/10 text-violet-bright">
              <Info size={16} strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="break-words font-display text-base font-semibold text-white sm:text-lg">
                This page will be updated
              </h2>
              <p className="mt-1.5 break-words text-sm leading-relaxed text-white/55">
                Payment is not being collected right now. Keep an eye on this
                page and the {event.name} {event.edition} announcements for the
                official fee and secure payment link.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
