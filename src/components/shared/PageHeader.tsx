import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, createHref, createLabel = "Create New", action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {action}
        {createHref && (
          <Button asChild size="sm" className="gap-1.5">
            <Link href={createHref}>
              <Plus className="h-4 w-4" />
              {createLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
