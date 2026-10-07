import type { Metadata } from "next";
import { AdminBar } from "@/components/admin/AdminBar";
import { hasAdminSession } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin",
  // Never indexed: this area lists personal data.
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Absent on the sign-in page, where there is no session to end.
  const signedIn = await hasAdminSession();
  return (
    <div data-admin-area className="min-h-dvh bg-ground">
      {signedIn ? <AdminBar /> : null}
      {children}
    </div>
  );
}
