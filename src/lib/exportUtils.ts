import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parseISO } from "date-fns";
import type { TransactionSummary, TransactionReport } from "@/types/transaction";

// CSV Export for Transaction Summary
export function exportSummaryToCSV(data: TransactionSummary[], dateRange: string) {
  const headers = ["Date", "Transaction Count", "Total Amount", "Net Sales", "Total Tax"];
  const rows = data.map((item) => [
    format(parseISO(item.date), "yyyy-MM-dd"),
    item.count.toString(),
    item.totalAmount.toFixed(2),
    item.netSales.toFixed(2),
    item.totalTax.toFixed(2),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  downloadFile(csvContent, `transaction-summary-${dateRange}.csv`, "text/csv");
}

// CSV Export for Transaction Report
export function exportReportToCSV(data: TransactionReport[], dateRange: string) {
  const headers = ["Receipt Number", "Date & Time", "Invoice Amount", "Tax Amount", "Status"];
  const rows = data.map((item) => [
    item.receiptNumber,
    format(parseISO(item.receiptDateTime), "yyyy-MM-dd HH:mm:ss"),
    item.invoiceAmount.toFixed(2),
    item.taxAmount.toFixed(2),
    item.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  downloadFile(csvContent, `transaction-report-${dateRange}.csv`, "text/csv");
}

// PDF Export for Summary
export function exportSummaryToPDF(data: TransactionSummary[], dateRange: string) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text("Transaction Summary Report", 14, 22);
  
  // Date range
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Period: ${dateRange}`, 14, 32);
  doc.text(`Generated: ${format(new Date(), "MMMM d, yyyy HH:mm")}`, 14, 38);

  // Calculate totals
  const totals = data.reduce(
    (acc, item) => ({
      count: acc.count + item.count,
      totalAmount: acc.totalAmount + item.totalAmount,
      netSales: acc.netSales + item.netSales,
      totalTax: acc.totalTax + item.totalTax,
    }),
    { count: 0, totalAmount: 0, netSales: 0, totalTax: 0 }
  );

  // Summary box
  doc.setFillColor(240, 240, 240);
  doc.rect(14, 45, 180, 25, "F");
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text(`Total Transactions: ${totals.count}`, 20, 54);
  doc.text(`Total Amount: AED ${totals.totalAmount.toFixed(2)}`, 70, 54);
  doc.text(`Net Sales: AED ${totals.netSales.toFixed(2)}`, 120, 54);
  doc.text(`Total Tax: AED ${totals.totalTax.toFixed(2)}`, 165, 54);

  // Table
  const tableData = data.map((item) => [
    format(parseISO(item.date), "MMM d, yyyy"),
    item.count.toString(),
    `AED ${item.totalAmount.toFixed(2)}`,
    `AED ${item.netSales.toFixed(2)}`,
    `AED ${item.totalTax.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 78,
    head: [["Date", "Transactions", "Total Amount", "Net Sales", "Tax"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [45, 130, 120], textColor: 255 },
    styles: { fontSize: 9 },
  });

  doc.save(`transaction-summary-${dateRange}.pdf`);
}

// PDF Export for Report
export function exportReportToPDF(data: TransactionReport[], dateRange: string) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text("Transaction Detail Report", 14, 22);
  
  // Date range
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Period: ${dateRange}`, 14, 32);
  doc.text(`Generated: ${format(new Date(), "MMMM d, yyyy HH:mm")}`, 14, 38);
  doc.text(`Total Transactions: ${data.length}`, 14, 44);

  // Table
  const tableData = data.map((item) => [
    item.receiptNumber,
    format(parseISO(item.receiptDateTime), "MMM d, HH:mm"),
    `AED ${item.invoiceAmount.toFixed(2)}`,
    `AED ${item.taxAmount.toFixed(2)}`,
    item.status,
  ]);

  autoTable(doc, {
    startY: 52,
    head: [["Receipt #", "Date & Time", "Invoice", "Tax", "Status"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [45, 130, 120], textColor: 255 },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 35 },
      4: { cellWidth: 25 },
    },
  });

  doc.save(`transaction-report-${dateRange}.pdf`);
}

// Helper function to download files
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
