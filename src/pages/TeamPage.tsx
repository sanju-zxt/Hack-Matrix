import { useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  Loader2,
  Search,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { contact, event } from "../data/eventConfig";
import { usePageMeta } from "../lib/seo";
import {
  AdminApiError,
  adminConfigured,
  lookupTeam,
  teamTitle,
  type AdminTeam,
} from "../lib/adminApi";
import { normalizeStatus } from "../lib/teamStatus";
import { Container } from "../components/ui/Section";
import { Reveal } from "../components/ui/Reveal";
import { TeamStatusBadge } from "../components/ui/TeamStatusBadge";

function TeamCard({ team }: { team: AdminTeam }) {
  const status = normalizeStatus(team.status);
  const fields = Object.entries(team.values).filter(([, value]) => value.trim().length > 0);

  return (
    <div className="glass flex h-full min-w-0 flex-col rounded-2xl p-5 sm:p-8">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <h2 className="min-w-0 break-words font-display text-xl font-semibold text-white sm:text-2xl">
          {teamTitle(team)}
        </h2>
        <TeamStatusBadge status={status} />
      </div>

      {fields.length > 0 && (
        <dl className="mt-5 space-y-2">
          {fields.map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col gap-0.5 border-b border-white/5 pb-2 last:border-0 last:pb-0 sm:flex-row sm:gap-3"
            >
              <dt className="shrink-0 text-xs font-medium uppercase tracking-wider text-white/40 sm:w-36">
                {key}
              </dt>
              <dd className="min-w-0 break-words text-sm text-white/80">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass mx-auto mt-8 flex max-w-xl flex-col items-center rounded-2xl p-8 text-center">
      <Users size={22} strokeWidth={1.75} className="text-white/40" aria-hidden />
      <h2 className="mt-3 font-display text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 break-words text-sm leading-relaxed text-white/60">{body}</p>
    </div>
  );
}

export default function TeamPage() {
  usePageMeta({
    title: "Team Status",
    description:
      "Check your IGNITE 2026 team registration, members and approval status using the email you registered with or your team code.",
    canonicalPath: "/team",
  });

  const configured = adminConfigured();
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<AdminTeam[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = query.trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    setTeams(null);
    try {
      setTeams(await lookupTeam(value));
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20">
      <Container className="relative">
        <Reveal>
          <p className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.25em] text-violet-bright sm:text-xs">
            <ShieldCheck size={13} strokeWidth={2} className="shrink-0" aria-hidden />
            TEAM STATUS
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="text-center font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Check your <span className="text-gradient">team status</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-2xl break-words text-center text-base leading-relaxed text-white/60 sm:text-lg">
            Enter the email address any member registered with (or your team code)
            to see your team&apos;s members, registration and approval status.
          </p>
        </Reveal>

        {!configured && (
          <Reveal delay={0.15}>
            <div className="glass mx-auto mt-8 max-w-xl rounded-2xl p-5 sm:mt-12 sm:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-violet/20 bg-violet/10 text-violet-bright">
                <Wrench size={18} strokeWidth={1.75} aria-hidden />
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold text-white sm:text-2xl">
                Team status isn&apos;t connected yet
              </h2>
              <p className="mt-2 break-words text-sm leading-relaxed text-white/60">
                This page goes live with the organizer dashboard once{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-white/80">
                  admin.endpoint
                </code>{" "}
                is set. See{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-white/80">
                  tool/apps-script/README.md
                </code>
                . Until then, contact the organizers at {contact.email}.
              </p>
            </div>
          </Reveal>
        )}

        {configured && (
          <Reveal delay={0.15}>
            <form
              onSubmit={onSubmit}
              className="glass-strong mx-auto mt-8 max-w-md rounded-2xl p-5 sm:mt-12 sm:p-8"
            >
              <label
                htmlFor="team-query"
                className="block font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55"
              >
                Registered email or team code
              </label>
              <div className="mt-3 flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 focus-within:border-violet/60">
                <Search size={17} strokeWidth={1.75} className="shrink-0 text-white/40" aria-hidden />
                <input
                  id="team-query"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                  placeholder="you@college.edu"
                />
              </div>
              <button
                type="submit"
                disabled={loading || query.trim().length === 0}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet to-violet-deep px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_8px_30px_-6px_rgba(124,108,255,0.55)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-bright disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
                {loading ? "Checking…" : "Check status"}
              </button>
            </form>
          </Reveal>
        )}

        {error && (
          <div
            role="alert"
            className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200"
          >
            <AlertCircle size={16} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden />
            <span className="min-w-0 break-words">{error}</span>
          </div>
        )}

        {configured && teams !== null && teams.length === 0 && (
          <Notice
            title="No team found"
            body="We couldn't find a registration matching that email or team code. Double-check the email you used in the form, or contact the organizers."
          />
        )}

        {teams !== null && teams.length > 0 && (
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:mt-12">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}

        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-2xl break-words text-center text-xs leading-relaxed text-white/40">
            Trouble finding your team? Contact the {event.name} {event.edition}{" "}
            organizers at{" "}
            <a
              href={`mailto:${contact.email}`}
              className="font-semibold text-violet-bright underline-offset-4 transition-colors hover:underline"
            >
              {contact.email}
            </a>
            .
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
