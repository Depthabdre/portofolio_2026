import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getJournalData } from "@/lib/supabase/queries";
import { isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Journal Studio | Abdrehim Misbah" };

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const data = await getJournalData(true);
  const configured =
    !!(
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    ) && !!(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  return <AdminDashboard data={data} configured={configured} />;
}
