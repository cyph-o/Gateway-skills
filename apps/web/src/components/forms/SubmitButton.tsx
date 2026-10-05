"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/primitives/Button";

/** Disabled while in flight, which is also the first line of defence against
 *  a double-tap on a slow connection. */
export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Sending…" : label}
      {pending ? null : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
    </Button>
  );
}
