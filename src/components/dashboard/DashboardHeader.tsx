import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/dashboard/ExportButton";
import type { TransactionSummary, TransactionReport } from "@/types/transaction";

interface DashboardHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  summaryData?: TransactionSummary[];
  reportData?: TransactionReport[];
  dateRangeLabel: string;
}

export function DashboardHeader({ 
  onRefresh, 
  isLoading, 
  summaryData, 
  reportData, 
  dateRangeLabel 
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Transaction Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and analyze your transaction data
        </p>
      </div>
      <div className="flex items-center gap-2">
        <ExportButton 
          summaryData={summaryData} 
          reportData={reportData} 
          dateRangeLabel={dateRangeLabel}
        />
        <Button
          onClick={onRefresh}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    </header>
  );
}
