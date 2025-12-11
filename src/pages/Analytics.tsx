import { useState } from "react";
import { DollarSign, Receipt, TrendingUp, Percent } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useTransactionSummary } from "@/hooks/useTransactionData";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { LoadingSkeleton } from "@/components/dashboard/LoadingSkeleton";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { exportSummaryToCSV, exportSummaryToPDF } from "@/lib/exportUtils";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, FileSpreadsheet } from "lucide-react";

const Analytics = () => {
  const queryClient = useQueryClient();
  
  // Default date range: Dec 1-2, 2025 (matching the original API params)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 11, 1),
    to: new Date(2025, 11, 2),
  });

  const fromDate = dateRange?.from || new Date(2025, 11, 1);
  const toDate = dateRange?.to || new Date(2025, 11, 2);

  const { data: summaryData, isLoading: summaryLoading } = useTransactionSummary(fromDate, toDate);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["transactionSummary"] });
  };

  const totals = summaryData?.reduce(
    (acc, item) => ({
      count: acc.count + item.count,
      totalAmount: acc.totalAmount + item.totalAmount,
      totalTax: acc.totalTax + item.totalTax,
      netSales: acc.netSales + item.netSales,
    }),
    { count: 0, totalAmount: 0, totalTax: 0, netSales: 0 }
  );

  const dateRangeLabel = dateRange?.from && dateRange?.to
    ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`
    : "Select dates";

  const handleExport = (type: "csv" | "pdf") => {
    try {
      const sanitizedLabel = dateRangeLabel.replace(/[^a-zA-Z0-9-]/g, "-");
      
      if (summaryData?.length) {
        if (type === "csv") {
          exportSummaryToCSV(summaryData, sanitizedLabel);
          toast({ title: "Export successful", description: "Summary CSV downloaded" });
        } else {
          exportSummaryToPDF(summaryData, sanitizedLabel);
          toast({ title: "Export successful", description: "Summary PDF downloaded" });
        }
      }
    } catch (error) {
      toast({ 
        title: "Export failed", 
        description: "An error occurred while exporting",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-safe-bottom">
      {/* Mobile-first: tighter spacing on mobile, more spacious on desktop */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-6 lg:py-8 space-y-4 md:space-y-6 lg:space-y-8">
        {/* Header - Mobile optimized */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Sales Analytics
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-0.5 md:mt-1">
              Burgers & Bites performance metrics
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Touch-friendly button with proper sizing */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!summaryData?.length}
                  className="h-11 px-4 touch-feedback"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden xs:inline">Export</span>
                  <span className="xs:hidden">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export Analytics</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={handleRefresh}
              disabled={summaryLoading}
              variant="outline"
              size="sm"
              className="h-11 px-4 touch-feedback"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${summaryLoading ? "animate-spin" : ""}`} />
              <span className="hidden xs:inline">Refresh</span>
              <span className="xs:hidden">Refresh</span>
            </Button>
          </div>
        </header>

        {/* Date Range Picker - Mobile optimized */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
          {dateRange?.from && dateRange?.to && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Showing data from {format(dateRange.from, "MMM d")} to {format(dateRange.to, "MMM d, yyyy")}
            </p>
          )}
        </div>

        {summaryLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Summary Cards - Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
                <SummaryCard
                  title="Total Sales"
                  value={totals?.totalAmount || 0}
                  subtitle="Combined revenue"
                  icon={DollarSign}
                />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                <SummaryCard
                  title="Net Sales"
                  value={totals?.netSales || 0}
                  subtitle="After tax"
                  icon={TrendingUp}
                />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                <SummaryCard
                  title="Total Tax"
                  value={totals?.totalTax || 0}
                  subtitle="Tax collected"
                  icon={Percent}
                />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                <SummaryCard
                  title="Transactions"
                  value={totals?.count || 0}
                  subtitle="Total receipts"
                  icon={Receipt}
                />
              </div>
            </div>

            {/* Chart Section - Mobile optimized */}
            <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
              {summaryData && summaryData.length > 0 ? (
                <TransactionChart data={summaryData} />
              ) : (
                <div className="bg-card rounded-lg p-6 md:p-8 text-center text-muted-foreground text-sm md:text-base">
                  No data available for the selected date range
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;

