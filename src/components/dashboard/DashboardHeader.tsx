import { Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function DashboardHeader({ onRefresh, isLoading }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Transaction Dashboard
        </h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">Dec 1 - Dec 2, 2025</span>
        </div>
      </div>
      <Button
        onClick={onRefresh}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="w-fit"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
        Refresh Data
      </Button>
    </header>
  );
}
