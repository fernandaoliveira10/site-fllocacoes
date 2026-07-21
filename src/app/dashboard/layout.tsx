import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { canAccessDashboard } from "@/lib/access";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!canAccessDashboard(session.user.role)) {
    redirect("/");
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <Sidebar name={session.user.name} />
      <div>{children}</div>
    </main>
  );
}
