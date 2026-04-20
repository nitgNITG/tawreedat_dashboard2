import { Users, Tag, Award, Package } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Suppliers", icon: Users, href: "/suppliers", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { label: "Categories", icon: Tag, href: "/categories", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
  { label: "Brands", icon: Award, href: "/brands", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { label: "Products", icon: Package, href: "/products", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome to Tawreedat admin panel. Manage your supply chain.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, icon: Icon, href, color, bg }) => (
          <Link key={href} href={href}>
            <Card className="group flex cursor-pointer items-center gap-4 p-5 transition-shadow hover:shadow-md">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold group-hover:text-primary transition-colors">Manage →</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold">Quick Start</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use the sidebar to navigate between modules. Each module supports full CRUD operations —
          create, view, edit, and delete records.
        </p>
      </div>
    </div>
  );
}
