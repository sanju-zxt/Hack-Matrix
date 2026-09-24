import { registration } from "../data/eventConfig";

/** Returns the official registration (Google Form) URL, or "" if not configured yet. */
export function getRegistrationUrl(): string {
  return registration.googleFormUrl.trim();
}

export const registrationReady = (): boolean =>
  getRegistrationUrl().length > 0;