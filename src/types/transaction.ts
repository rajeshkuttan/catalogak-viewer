export interface TransactionSummary {
  branchId: string;
  date: string;
  count: number;
  totalTax: number;
  totalAmount: number;
  netSales: number;
}

export interface TransactionReport {
  branchId: string;
  receiptNumber: string;
  receiptDateTime: string;
  invoiceAmount: number;
  taxAmount: number;
  status: string;
}
