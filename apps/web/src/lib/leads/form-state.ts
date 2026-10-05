import type { LeadFieldErrors } from "./schema";

/**
 * Shared form state. Deliberately NOT declared in the "use server" action
 * module: such a file may only export async functions, so a plain object
 * constant there breaks the build at runtime.
 */
export interface LeadFormState {
  status: "idle" | "error";
  errors?: LeadFieldErrors;
  /** Echoed back so a rejected submission never loses what was typed. */
  values?: Record<string, string>;
}

export const initialLeadFormState: LeadFormState = { status: "idle" };
