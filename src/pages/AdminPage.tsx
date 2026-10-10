import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  Check,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { admin, event } from "../data/eventConfig";
import { usePageMeta } from "../lib/seo";
import {
  AdminApiError,
  adminConfigured,
  decideTeam,
  fetchTeams,
  teamTitle,
  type AdminTeam,
} from "../lib/adminApi";
import { Container } from "../components/ui/Section";
import { Reveal } from "../components/ui/Reveal";
import { TeamStatusBadge } from "../components/ui/TeamStatusBadge";
import { DECISIONS, normalizeStatus, type Decision } from "../lib/teamStatus";
import { cn } from "../lib/cn";

type StatusFilter = "All" | Decision;

function SetupNotice() {
  return (
    <Reveal>
      <div className="glass mx-auto mt-8 max-w-2xl rounded-2xl p-5 sm:p-8">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-violet/20 bg-violet/10 text-violet-bright">
          <Wrench size={18} strokeWidth={1.75} aria-hidden />
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold text-white sm:text-2xl">
          Dashboard not connected yet
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          The organizer dashboard is built but not wired to the registration
          sheet. To switch it on:
        </p>
        <ol className="mt-6 space-y-3">
          {[
            "Open the Google Sheet that collects your form responses.",
            "Extensions → Apps Script → paste the code from tool/apps-script/Code.gs.",
            "Add a Script Property IGNITE_ADMIN_PASSCODE with your secret passcode.",
            "Deploy → New deployment → Web app (Execute as: Me, Access: Anyone).",
            "Copy the /exec URL into admin.endpoint in src/data/eventConfig.ts.",
          ].map((step, i) => (
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
  );
}

export default function AdminPage() {
  usePageMeta({
    title: "Organizer Dashboard",
    description:
      "Private organizer dashboard for reviewing and approving IGNITE 2026 team registrations.",
    canonicalPath: "/admin",
  });

  const configured = adminConfigured();
  const [token, setToken] = useState<string>(() => {
    try {
      return sessionStorage.getItem(admin.sessionKey) ?? "";
    } catch {
      return "";
    }
  });
  const [input, setInput] = useState("");
  const [teams, setTeams] = useState<AdminTeam[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [busyId, setBusyId] = useState<string | null>(null);

  const signOut = useCallback(() => {
    try {
      sessionStorage.removeItem(admin.sessionKey);
    } catch {
      /* ignore */
    }
    setToken("");
    setTeams(null);
    setError(null);
  }, []);

  const load = useCallback(
    async (activeToken: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTeams(activeToken);
        setTeams(result);
      } catch (err) {
        const message =
          err instanceof AdminApiError ? err.message : "Something went wrong.";
        setError(message);
        if (err instanceof AdminApiError && err.status === 401) {
          try {
            sessionStorage.removeItem(admin.sessionKey);
          } catch {
            /* ignore */
          }
          setToken("");
          setTeams(null);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!configured || !token) return;
    const timer = window.setTimeout(() => void load(token), 0);
    return () => window.clearTimeout(timer);
  }, [configured, token, load]);

  const onUnlock = (e: FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    try {
      sessionStorage.setItem(admin.sessionKey, value);
    } catch {
      /* ignore */
    }
    setInput("");
    setToken(value);
  };

  const decide = async (team: AdminTeam, status: Decision) => {
    if (!token) return;
    setBusyId(team.id);
    setError(null);
    try {
      await decideTeam(token, team.id, status);
      setTeams((prev) =>
        prev ? prev.map((t) => (t.id === team.id ? { ...t, status } : t)) : prev
      );
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const withStatus = useMemo(
    () =>
      (teams ?? []).map((team) => ({
        team,
        status: normalizeStatus(team.status),
        title: teamTitle(team),
      })),
    [teams]
  );

  const counts = useMemo(() => {
    const base: Record<StatusFilter, number> = {
      All: withStatus.length,
      Approved: 0,
      Rejected: 0,
      Pending: 0,
    };
    for (const { status } of withStatus) base[status] += 1;
    return base;
  }, [withStatus]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return withStatus
      .filter((row) => (filter === "All" ? true : row.status === filter))
      .filter((row) =>
        q
          ? row.title.toLowerCase().includes(q) ||
            Object.values(row.team.values).some((value) =>
              value.toLowerCase().includes(q)
            )
          : true
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [withStatus, filter, query]);

  return (
    <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20">
      <Container className="relative">
        <Reveal>
          <p className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.25em] text-violet-bright sm:text-xs">
            <ShieldCheck size={13} strokeWidth={2} className="shrink-0" aria-hidden />
            ORGANIZERS ONLY
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="text-center font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Team approval{" "}
            <span className="text-gradient">dashboard</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-white/60 sm:text-lg">
            {admin.hint}
          </p>
        </Reveal>

        {!configured && <SetupNotice />}

        {configured && !token && (
          <Reveal delay={0.15}>
            <form
              onSubmit={onUnlock}
              className="glass-strong mx-auto mt-8 max-w-md rounded-2xl p-5 sm:mt-12 sm:p-8"
            >
              <label
                htmlFor="admin-passcode"
                className="block font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55"
              >
                Organizer passcode
              </label>
              <div className="mt-3 flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 focus-within:border-violet/60">
                <KeyRound size={18} strokeWidth={1.75} className="shrink-0 text-white/40" aria-hidden />
                <input
                  id="admin-passcode"
                  type="password"
                  autoComplete="current-password"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                  placeholder="Enter passcode"
                />
              </div>
              <button
                type="submit"
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet to-violet-deep px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_8px_30px_-6px_rgba(124,108,255,0.55)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-bright"
              >
                Unlock dashboard
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

        {configured && token && (
          <div className="mt-8 sm:mt-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {(["All", ...DECISIONS] as StatusFilter[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    aria-pressed={filter === key}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors",
                      filter === key
                        ? "border-violet/60 bg-violet/15 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/60 hover:border-violet/40 hover:text-white"
                    )}
                  >
                    {key}
                    <span className="font-mono text-[0.65rem] text-white/50">
                      {counts[key]}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void load(token)}
                  disabled={loading}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-white/70 transition-colors hover:border-violet/40 hover:text-white disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    strokeWidth={1.75}
                    className={cn(loading && "animate-spin")}
                    aria-hidden
                  />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-white/70 transition-colors hover:border-rose-400/40 hover:text-rose-200"
                >
                  <LogOut size={15} strokeWidth={1.75} aria-hidden />
                  Sign out
                </button>
              </div>
            </div>

            <div className="mt-5 flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 focus-within:border-violet/60">
              <Search size={17} strokeWidth={1.75} className="shrink-0 text-white/40" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search teams"
                placeholder="Search by team, member, college, email…"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>

            {loading && teams === null && (
              <div className="mt-10 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-white/55">
                <Loader2 size={16} className="animate-spin" aria-hidden />
                Loading teams…
              </div>
            )}

            {teams !== null && visible.length === 0 && (
              <div className="glass mx-auto mt-8 flex max-w-md flex-col items-center rounded-2xl p-8 text-center">
                <Users size={22} strokeWidth={1.75} className="text-white/40" aria-hidden />
                <p className="mt-3 text-sm text-white/60">
                  {teams.length === 0
                    ? "No team registrations found yet."
                    : "No teams match your search or filter."}
                </p>
              </div>
            )}

            {visible.length > 0 && (
              <ul className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {visible.map(({ team, status, title }) => {
                  const busy = busyId === team.id;
                  const fields = Object.entries(team.values).filter(
                    ([, value]) => value.trim().length > 0
                  );
                  return (
                    <li key={team.id} className="min-w-0">
                      <div className="glass flex h-full min-w-0 flex-col rounded-2xl p-5">
                        <div className="flex min-w-0 items-start justify-between gap-3">
                          <h2 className="min-w-0 break-words font-display text-lg font-semibold text-white">
                            {title}
                          </h2>
                          <TeamStatusBadge status={status} />
                        </div>

                        {fields.length > 0 && (
                          <dl className="mt-4 space-y-2">
                            {fields.map(([key, value]) => (
                              <div
                                key={key}
                                className="flex flex-col gap-0.5 border-b border-white/5 pb-2 last:border-0 last:pb-0 sm:flex-row sm:gap-3"
                              >
                                <dt className="shrink-0 text-xs font-medium uppercase tracking-wider text-white/40 sm:w-32">
                                  {key}
                                </dt>
                                <dd className="min-w-0 break-words text-sm text-white/80">
                                  {value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}

                        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                          <button
                            type="button"
                            onClick={() => void decide(team, "Approved")}
                            disabled={busy || status === "Approved"}
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {busy ? (
                              <Loader2 size={15} className="animate-spin" aria-hidden />
                            ) : (
                              <Check size={15} strokeWidth={2.25} aria-hidden />
                            )}
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => void decide(team, "Rejected")}
                            disabled={busy || status === "Rejected"}
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <X size={15} strokeWidth={2.25} aria-hidden />
                            Reject
                          </button>
                          {status !== "Pending" && (
                            <button
                              type="button"
                              onClick={() => void decide(team, "Pending")}
                              disabled={busy}
                              className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-white/60 transition-colors hover:border-violet/40 hover:text-white disabled:opacity-50"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-2xl break-words text-center text-xs leading-relaxed text-white/40">
            Private page for the {event.name} {event.edition} organizing team.
            This dashboard is not linked anywhere on the public site.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
