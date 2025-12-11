import * as React from "react";
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const presets = [
  {
    label: "Today",
    getValue: () => {
      const today = new Date();
      return { from: today, to: today };
    },
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = subDays(new Date(), 1);
      return { from: yesterday, to: yesterday };
    },
  },
  {
    label: "Last 7 days",
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: "This Week",
    getValue: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "This Month",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
];

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handlePresetClick = (preset: typeof presets[0]) => {
    onDateRangeChange(preset.getValue());
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Mobile-first: touch-friendly button */}
        <Button
          variant="outline"
          className={cn(
            "w-full md:w-[300px] h-11 justify-start text-left font-normal touch-feedback",
            !dateRange && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate text-sm md:text-base">
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {/* Mobile: shorter format */}
                  <span className="md:hidden">
                    {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yy")}
                  </span>
                  {/* Desktop: full format */}
                  <span className="hidden md:inline">
                    {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                  </span>
                </>
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              <span>Select date range</span>
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        align="start"
        sideOffset={5}
      >
        {/* Mobile-first: stack vertically on mobile, side-by-side on desktop */}
        <div className="flex flex-col md:flex-row">
          {/* Quick presets */}
          <div className="border-b md:border-b-0 md:border-r border-border p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
              Quick Select
            </p>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs md:text-sm font-normal h-9 touch-target"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Calendar - Mobile: 1 month, Desktop: 2 months */}
          <div className="overflow-x-auto">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={1} // Always 1 month for better mobile experience
              className={cn("p-3 pointer-events-auto")}
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                  "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 touch-target"
                ),
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                  "h-9 w-9 p-0 font-normal aria-selected:opacity-100 touch-target"
                ),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
