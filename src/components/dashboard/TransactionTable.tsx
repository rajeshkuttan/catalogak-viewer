import { useState, useMemo } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TransactionReport } from "@/types/transaction";
import { format, parseISO } from "date-fns";

interface TransactionTableProps {
  data: TransactionReport[];
}

export function TransactionTable({ data }: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Get unique statuses from data
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(data.map((t) => t.status));
    return Array.from(statuses).sort();
  }, [data]);

  // Filter data based on search and status
  const filteredData = useMemo(() => {
    return data.filter((transaction) => {
      const matchesSearch = searchQuery === "" || 
        transaction.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedData = filteredData.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  return (
    <Card className="border-0 bg-card shadow-sm">
      {/* Mobile-optimized header with better spacing */}
      <CardHeader className="pb-3 md:pb-4 px-3 md:px-6 pt-4 md:pt-6">
        <div className="flex flex-col gap-3 md:gap-4">
          <CardTitle className="text-base md:text-lg font-semibold text-foreground">
            Transaction Details
          </CardTitle>
          
          {/* Mobile-first: stack filters vertically on mobile */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-3">
            {/* Search Input - Touch-friendly sizing */}
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search receipt number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full md:w-[220px] h-11 text-base touch-target"
                type="search"
                inputMode="search"
              />
            </div>
            
            {/* Status Filter - Touch-friendly */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px] h-11 touch-target">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status} className="touch-target">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Filter summary - Mobile optimized */}
        {(searchQuery || statusFilter !== "all") && (
          <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
            Showing {filteredData.length} of {data.length} transactions
            {searchQuery && <span> matching "{searchQuery}"</span>}
            {statusFilter !== "all" && <span> with status "{statusFilter}"</span>}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile-first: shorter max height on mobile, smooth scrolling */}
        <div className="overflow-auto max-h-[320px] md:max-h-[400px] smooth-scroll">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                {/* Mobile: hide date column, show only essential info */}
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0 bg-card z-10 px-3 md:px-4">
                  Receipt #
                </TableHead>
                <TableHead className="hidden sm:table-cell text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0 bg-card z-10 px-3 md:px-4">
                  Date & Time
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0 bg-card z-10 text-right px-3 md:px-4">
                  Amount
                </TableHead>
                <TableHead className="hidden md:table-cell text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0 bg-card z-10 text-right px-3 md:px-4">
                  Tax
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0 bg-card z-10 text-center px-3 md:px-4">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedData.length > 0 ? (
                displayedData.map((transaction, index) => (
                  <TableRow 
                    key={transaction.receiptNumber}
                    className="border-b border-border/50 active:bg-muted/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${Math.min(index * 20, 300)}ms` }}
                  >
                    {/* Receipt Number - with date on mobile */}
                    <TableCell className="font-mono text-xs md:text-sm text-foreground px-3 md:px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div>
                          {searchQuery ? (
                            <HighlightText text={transaction.receiptNumber} highlight={searchQuery} />
                          ) : (
                            transaction.receiptNumber
                          )}
                        </div>
                        {/* Show date on mobile only */}
                        <div className="sm:hidden text-xs text-muted-foreground font-sans">
                          {format(parseISO(transaction.receiptDateTime), "MMM d, HH:mm")}
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Date & Time - Hidden on mobile */}
                    <TableCell className="hidden sm:table-cell text-xs md:text-sm text-muted-foreground px-3 md:px-4 py-3">
                      {format(parseISO(transaction.receiptDateTime), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    
                    {/* Invoice Amount - with tax on mobile */}
                    <TableCell className="text-right font-mono text-xs md:text-sm font-medium text-foreground px-3 md:px-4 py-3">
                      <div className="flex flex-col gap-0.5 items-end">
                        <div className="whitespace-nowrap">
                          AED {transaction.invoiceAmount.toFixed(2)}
                        </div>
                        {/* Show tax on mobile */}
                        <div className="md:hidden text-xs text-muted-foreground">
                          Tax: {transaction.taxAmount.toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Tax - Hidden on mobile, shown separately in amount cell */}
                    <TableCell className="hidden md:table-cell text-right font-mono text-xs md:text-sm text-muted-foreground px-3 md:px-4 py-3 whitespace-nowrap">
                      AED {transaction.taxAmount.toFixed(2)}
                    </TableCell>
                    
                    {/* Status - Compact on mobile */}
                    <TableCell className="text-center px-3 md:px-4 py-3">
                      <span 
                        className={`inline-flex items-center px-2 py-1 md:px-2.5 md:py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          transaction.status === "SALES" 
                            ? "bg-success/15 text-success" 
                            : transaction.status === "REFUND"
                            ? "bg-destructive/15 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 px-4 text-muted-foreground text-sm">
                    No transactions found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Controls - Mobile-first design */}
        {filteredData.length > 0 && (
          <div className="p-3 md:p-4 flex flex-col gap-3 border-t border-border bg-muted/20">
            {/* Mobile: Stack vertically, Desktop: Row layout */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Page Size Selector - Touch-friendly */}
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground w-full sm:w-auto justify-center sm:justify-start">
                <span className="whitespace-nowrap">Show</span>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-[75px] h-10 touch-target">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10" className="touch-target">10</SelectItem>
                    <SelectItem value="20" className="touch-target">20</SelectItem>
                    <SelectItem value="50" className="touch-target">50</SelectItem>
                    <SelectItem value="100" className="touch-target">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="whitespace-nowrap">per page</span>
              </div>

              {/* Results Counter */}
              <div className="text-xs md:text-sm text-muted-foreground text-center sm:text-left order-3 sm:order-2">
                <span className="font-medium text-foreground">
                  {startIndex + 1}–{Math.min(endIndex, filteredData.length)}
                </span>
                {" "}of{" "}
                <span className="font-medium text-foreground">
                  {filteredData.length}
                </span>
              </div>
              
              {/* Navigation Buttons - Touch-friendly */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center order-2 sm:order-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="h-11 px-3 md:px-4 touch-feedback flex-1 sm:flex-initial"
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                
                {/* Page indicator */}
                <div className="flex items-center px-3 md:px-4 h-11 bg-muted rounded-md border border-border">
                  <span className="text-xs md:text-sm font-medium text-foreground whitespace-nowrap">
                    <span className="hidden sm:inline">Page </span>
                    {currentPage} / {totalPages}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="h-11 px-3 md:px-4 touch-feedback flex-1 sm:flex-initial"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 sm:ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper component to highlight search matches
function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
