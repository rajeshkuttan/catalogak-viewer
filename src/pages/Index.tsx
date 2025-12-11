import { DollarSign, Receipt, TrendingUp, Percent } from "lucide-react";
import { useTransactionSummary, useTransactionReport } from "@/hooks/useTransactionData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { LoadingSkeleton } from "@/components/dashboard/LoadingSkeleton";
import { useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const queryClient = useQueryClient();
  const { data: summaryData, isLoading: summaryLoading } = useTransactionSummary();
  const { data: reportData, isLoading: reportLoading } = useTransactionReport();

  const isLoading = summaryLoading || reportLoading;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["transactionSummary"] });
    queryClient.invalidateQueries({ queryKey: ["transactionReport"] });
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <DashboardHeader onRefresh={handleRefresh} isLoading={isLoading} />

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Chart Section */}
            <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
              {summaryData && <TransactionChart data={summaryData} />}
            </div>

            {/* Transaction Table */}
            <div className="animate-fade-in" style={{ animationDelay: "500ms" }}>
              {reportData && <TransactionTable data={reportData} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
