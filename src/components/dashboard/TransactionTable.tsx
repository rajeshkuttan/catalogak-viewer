import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

  const displayedData = filteredData.slice(0, 50);

  return (
    <Card className="border-0 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-foreground">Transaction Details</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search receipt #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-[200px] h-9"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px] h-9">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Filter summary */}
        {(searchQuery || statusFilter !== "all") && (
          <p className="text-sm text-muted-foreground mt-2">
            Showing {filteredData.length} of {data.length} transactions
            {searchQuery && <span> matching "{searchQuery}"</span>}
            {statusFilter !== "all" && <span> with status "{statusFilter}"</span>}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0 bg-card">Receipt #</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0 bg-card">Date & Time</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0 bg-card text-right">Invoice</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0 bg-card text-right">Tax</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0 bg-card text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedData.length > 0 ? (
                displayedData.map((transaction, index) => (
                  <TableRow 
                    key={transaction.receiptNumber}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    <TableCell className="font-mono text-sm text-foreground">
                      {searchQuery ? (
                        <HighlightText text={transaction.receiptNumber} highlight={searchQuery} />
                      ) : (
                        transaction.receiptNumber
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(parseISO(transaction.receiptDateTime), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium text-foreground">
                      ${transaction.invoiceAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      ${transaction.taxAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No transactions found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {filteredData.length > 50 && (
          <div className="p-4 text-center text-sm text-muted-foreground border-t border-border">
            Showing 50 of {filteredData.length} filtered transactions
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
