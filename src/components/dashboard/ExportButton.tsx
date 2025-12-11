import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TransactionSummary, TransactionReport } from "@/types/transaction";
import {
  exportSummaryToCSV,
  exportReportToCSV,
  exportSummaryToPDF,
  exportReportToPDF,
} from "@/lib/exportUtils";
import { toast } from "@/hooks/use-toast";

interface ExportButtonProps {
  summaryData: TransactionSummary[] | undefined;
  reportData: TransactionReport[] | undefined;
  dateRangeLabel: string;
}

export function ExportButton({ summaryData, reportData, dateRangeLabel }: ExportButtonProps) {
  const handleExport = (type: "summary-csv" | "summary-pdf" | "report-csv" | "report-pdf") => {
    try {
      const sanitizedLabel = dateRangeLabel.replace(/[^a-zA-Z0-9-]/g, "-");
      
      switch (type) {
        case "summary-csv":
          if (summaryData?.length) {
            exportSummaryToCSV(summaryData, sanitizedLabel);
            toast({ title: "Export successful", description: "Summary CSV downloaded" });
          }
          break;
        case "summary-pdf":
          if (summaryData?.length) {
            exportSummaryToPDF(summaryData, sanitizedLabel);
            toast({ title: "Export successful", description: "Summary PDF downloaded" });
          }
          break;
        case "report-csv":
          if (reportData?.length) {
            exportReportToCSV(reportData, sanitizedLabel);
            toast({ title: "Export successful", description: "Report CSV downloaded" });
          }
          break;
        case "report-pdf":
          if (reportData?.length) {
            exportReportToPDF(reportData, sanitizedLabel);
            toast({ title: "Export successful", description: "Report PDF downloaded" });
          }
          break;
      }
    } catch (error) {
      toast({ 
        title: "Export failed", 
        description: "An error occurred while exporting",
        variant: "destructive" 
      });
    }
  };

  const hasData = (summaryData?.length ?? 0) > 0 || (reportData?.length ?? 0) > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={!hasData}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Summary Report</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleExport("summary-csv")}
          disabled={!summaryData?.length}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Download CSV
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport("summary-pdf")}
          disabled={!summaryData?.length}
        >
          <FileText className="h-4 w-4 mr-2" />
          Download PDF
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Transaction Details</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleExport("report-csv")}
          disabled={!reportData?.length}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Download CSV
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport("report-pdf")}
          disabled={!reportData?.length}
        >
          <FileText className="h-4 w-4 mr-2" />
          Download PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
