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
      className="overflow-hidden border-0 bg-card shadow-sm active:shadow-md transition-all duration-200 touch-feedback"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Mobile-first: compact padding on mobile, more spacious on desktop */}
      <CardContent className="p-4 md:p-5 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1.5 md:space-y-2 min-w-0">
            {/* Smaller text on mobile for better fit */}
            <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide truncate">
              {title}
            </p>
            {/* Responsive font sizing: smaller on mobile, larger on desktop */}
            <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground font-mono break-words">
              {typeof value === "number" ? `AED ${value.toLocaleString("en-AE", { minimumFractionDigits: 2 })}` : value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {/* Slightly smaller icon on mobile */}
          <div className="rounded-lg md:rounded-xl bg-accent p-2 md:p-3 flex-shrink-0">
            <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
