import { useQuery } from "@tanstack/react-query";
import type { TransactionSummary, TransactionReport } from "@/types/transaction";
import { format } from "date-fns";

const API_BASE = "https://api-client.catalogak.net/api/v6/Viewer";
const CREDENTIALS = {
  username: "TestBurgerry",
  password: "TestBurgerry@123",
  appKey: "F513903D-47AE-44FE-F06D-08DE36385AF9",
};

const buildUrl = (endpoint: string, from: Date, to: Date) => {
  const params = new URLSearchParams({
    username: CREDENTIALS.username,
    from: format(from, "yyyy-MM-dd"),
    to: format(to, "yyyy-MM-dd"),
    appKey: CREDENTIALS.appKey,
    password: CREDENTIALS.password,
  });
  return `${API_BASE}/${endpoint}?${params}`;
};

export function useTransactionSummary(from: Date, to: Date) {
  return useQuery<TransactionSummary[]>({
    queryKey: ["transactionSummary", format(from, "yyyy-MM-dd"), format(to, "yyyy-MM-dd")],
    queryFn: async () => {
      const response = await fetch(buildUrl("GetTransactionSummary", from, to));
      if (!response.ok) throw new Error("Failed to fetch summary");
      return response.json();
    },
  });
}

export function useTransactionReport(from: Date, to: Date) {
  return useQuery<TransactionReport[]>({
    queryKey: ["transactionReport", format(from, "yyyy-MM-dd"), format(to, "yyyy-MM-dd")],
    queryFn: async () => {
      const response = await fetch(buildUrl("GetTransactionReport", from, to));
      if (!response.ok) throw new Error("Failed to fetch report");
      return response.json();
    },
  });
}
