export type Decision = "Approved" | "Rejected" | "Pending";

export const DECISIONS: Decision[] = ["Approved", "Rejected", "Pending"];

export function normalizeStatus(value: string | null | undefined): Decision {
  const v = (value ?? "").trim().toLowerCase();
  if (!v) return "Pending";
  if (v.startsWith("approv") || v === "accepted" || v === "yes") return "Approved";
  if (v.startsWith("reject") || v === "declined" || v === "no") return "Rejected";
  return "Pending";
}

export const STATUS_STYLES: Record<Decision, string> = {
  Approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Rejected: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  Pending: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};
