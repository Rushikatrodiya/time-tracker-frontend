"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

interface DatePickerProps {
  date?: Date | string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  date,
  disabled = false,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Convert string date to Date object if needed
  const selectedDate = React.useMemo(() => {
    if (!date) return new Date();
    if (typeof date === "string") {
      return new Date(date);
    }
    return date;
  }, [date]);

  const formattedDate = React.useMemo(() => {
    return selectedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  // Always show the date picker UI, but prevent actual date changes
  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !selectedDate && "text-muted-foreground",
          disabled && "cursor-not-allowed opacity-75",
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {formattedDate}
      </Button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white border rounded-md shadow-lg p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={() => {
              // Just close the calendar, don't change the date
              setIsOpen(false);
            }}
            disabled={true} // Disable date selection in calendar
            initialFocus
          />
        </div>
      )}
    </div>
  );
}
