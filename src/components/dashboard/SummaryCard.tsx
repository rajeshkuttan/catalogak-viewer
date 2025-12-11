import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

export function SummaryCard({ title, value, subtitle, icon: Icon, delay = 0 }: SummaryCardProps) {
  return (
    <Card 
      className="overflow-hidden border-0 bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground font-mono">
              {typeof value === "number" ? value.toLocaleString("en-US", { minimumFractionDigits: 2 }) : value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="rounded-xl bg-accent p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
