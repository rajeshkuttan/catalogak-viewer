import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useTransactionReport } from "@/hooks/useTransactionData";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { exportReportToCSV, exportReportToPDF } from "@/lib/exportUtils";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, FileSpreadsheet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const Transactions = () => {
  const queryClient = useQueryClient();
  
  // Default date range: Dec 1-2, 2025 (matching the original API params)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 11, 1),
    to: new Date(2025, 11, 2),
  });

  const fromDate = dateRange?.from || new Date(2025, 11, 1);
  const toDate = dateRange?.to || new Date(2025, 11, 2);

  const { data: reportData, isLoading: reportLoading } = useTransactionReport(fromDate, toDate);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["transactionReport"] });
  };

  const dateRangeLabel = dateRange?.from && dateRange?.to
    ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`
    : "Select dates";

  const handleExport = (type: "csv" | "pdf") => {
    try {
      const sanitizedLabel = dateRangeLabel.replace(/[^a-zA-Z0-9-]/g, "-");
      
      if (reportData?.length) {
        if (type === "csv") {
          exportReportToCSV(reportData, sanitizedLabel);
          toast({ title: "Export successful", description: "Transaction report CSV downloaded" });
        } else {
          exportReportToPDF(reportData, sanitizedLabel);
          toast({ title: "Export successful", description: "Transaction report PDF downloaded" });
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
      {/* Mobile-first: optimized spacing */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-6 lg:py-8 space-y-4 md:space-y-6 lg:space-y-8">
        {/* Header - Mobile optimized */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Transaction Records
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-0.5 md:mt-1">
              Detailed sales and order history
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Touch-friendly export button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!reportData?.length}
                  className="h-11 px-4 touch-feedback"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export Transactions</DropdownMenuLabel>
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
              disabled={reportLoading}
              variant="outline"
              size="sm"
              className="h-11 px-4 touch-feedback"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${reportLoading ? "animate-spin" : ""}`} />
              Refresh
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

        {/* Transaction Table - Mobile optimized */}
        <div className="animate-fade-in">
          {reportLoading ? (
            <Card className="border-0 bg-card shadow-sm">
              <CardContent className="p-4 md:p-6">
                <Skeleton className="h-[300px] md:h-[400px] w-full" />
              </CardContent>
            </Card>
          ) : reportData && reportData.length > 0 ? (
            <TransactionTable data={reportData} />
          ) : (
            <div className="bg-card rounded-lg p-6 md:p-8 text-center text-muted-foreground text-sm md:text-base">
              No transactions found for the selected date range
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;

