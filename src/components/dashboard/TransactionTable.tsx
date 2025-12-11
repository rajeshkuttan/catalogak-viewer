import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { TransactionReport } from "@/types/transaction";
import { format, parseISO } from "date-fns";

interface TransactionTableProps {
  data: TransactionReport[];
}

export function TransactionTable({ data }: TransactionTableProps) {
  return (
    <Card className="border-0 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Transaction Details</CardTitle>
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
              {data.slice(0, 50).map((transaction, index) => (
                <TableRow 
                  key={transaction.receiptNumber}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell className="font-mono text-sm text-foreground">{transaction.receiptNumber}</TableCell>
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
                    <Badge 
                      variant={transaction.status === "SALES" ? "default" : "secondary"}
                      className={transaction.status === "SALES" 
                        ? "bg-success/15 text-success hover:bg-success/20 border-0" 
                        : "bg-muted text-muted-foreground"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {data.length > 50 && (
          <div className="p-4 text-center text-sm text-muted-foreground border-t border-border">
            Showing 50 of {data.length} transactions
          </div>
        )}
      </CardContent>
    </Card>
  );
}
