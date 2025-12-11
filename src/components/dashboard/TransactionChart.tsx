import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { TransactionSummary } from "@/types/transaction";
import { format, parseISO } from "date-fns";

interface TransactionChartProps {
  data: TransactionSummary[];
}

export function TransactionChart({ data }: TransactionChartProps) {
  // Mobile-first: shorter date format on mobile
  const chartData = data.map((item) => ({
    date: format(parseISO(item.date), "MMM d"),
    shortDate: format(parseISO(item.date), "M/d"), // Even shorter for very small screens
    totalAmount: item.totalAmount,
    netSales: item.netSales,
    count: item.count,
  }));

  return (
    <Card className="border-0 bg-card shadow-sm">
      <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
        <CardTitle className="text-base md:text-lg font-semibold text-foreground">
          Daily Sales Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 md:pt-4 px-2 md:px-6 pb-4 md:pb-6">
        {/* Mobile-first: shorter chart on mobile to save screen space */}
        <div className="h-[220px] sm:h-[260px] md:h-[280px] w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ 
                top: 5, 
                right: 5, 
                left: -10,  // Tighter on mobile
                bottom: 0 
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                vertical={false} 
                opacity={0.5}
              />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                interval="preserveStartEnd" // Better for mobile
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickFormatter={(value) => {
                  // Shorter format on mobile
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}k`;
                  }
                  return value.toString();
                }}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontSize: '0.875rem',
                  padding: '0.5rem 0.75rem'
                }}
                formatter={(value: number) => [`AED ${value.toFixed(2)}`, 'Sales']}
                labelStyle={{ 
                  color: 'hsl(var(--foreground))', 
                  fontWeight: 600,
                  marginBottom: '0.25rem'
                }}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
              />
              <Bar 
                dataKey="totalAmount" 
                name="Total Amount" 
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`hsl(var(--chart-${(index % 2) + 1}))`} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
