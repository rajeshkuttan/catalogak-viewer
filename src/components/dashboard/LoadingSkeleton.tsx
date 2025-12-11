import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Summary Cards Skeleton - Mobile optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 bg-card shadow-sm">
            <CardContent className="p-4 md:p-5 lg:p-6">
              <Skeleton className="h-3 md:h-4 w-20 md:w-24 mb-2 md:mb-3" />
              <Skeleton className="h-6 md:h-7 lg:h-8 w-28 md:w-32 mb-1.5 md:mb-2" />
              <Skeleton className="h-2.5 md:h-3 w-16 md:w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Chart Skeleton - Mobile optimized height */}
      <Card className="border-0 bg-card shadow-sm">
        <CardContent className="p-4 md:p-6">
          <Skeleton className="h-[220px] sm:h-[260px] md:h-[280px] w-full rounded-lg" />
        </CardContent>
      </Card>
      
      {/* Table Skeleton - Mobile optimized height */}
      <Card className="border-0 bg-card shadow-sm">
        <CardContent className="p-3 md:p-6">
          <Skeleton className="h-[280px] md:h-[300px] w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}
