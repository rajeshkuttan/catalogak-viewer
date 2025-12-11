import { useQuery } from "@tanstack/react-query";
import type { TransactionSummary, TransactionReport } from "@/types/transaction";

const API_BASE = "https://api-client.catalogak.net/api/v6/Viewer";
const CREDENTIALS = {
  username: "TestBurgerry",
  password: "TestBurgerry@123",
  appKey: "F513903D-47AE-44FE-F06D-08DE36385AF9",
  from: "2025-12-01",
  to: "2025-12-02",
};

const buildUrl = (endpoint: string) => {
  const params = new URLSearchParams({
    username: CREDENTIALS.username,
    from: CREDENTIALS.from,
    to: CREDENTIALS.to,
    appKey: CREDENTIALS.appKey,
    password: CREDENTIALS.password,
  });
  return `${API_BASE}/${endpoint}?${params}`;
};

export function useTransactionSummary() {
  return useQuery<TransactionSummary[]>({
    queryKey: ["transactionSummary"],
    queryFn: async () => {
      const response = await fetch(buildUrl("GetTransactionSummary"));
      if (!response.ok) throw new Error("Failed to fetch summary");
      return response.json();
    },
  });
}

export function useTransactionReport() {
  return useQuery<TransactionReport[]>({
    queryKey: ["transactionReport"],
    queryFn: async () => {
      const response = await fetch(buildUrl("GetTransactionReport"));
      if (!response.ok) throw new Error("Failed to fetch report");
      return response.json();
    },
  });
}
