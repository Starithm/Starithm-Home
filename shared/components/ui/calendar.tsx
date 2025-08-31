"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker, PropsSingle as DayPickerSingleProps } from "react-day-picker";


import { cn } from "../../utils/cn";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker & DayPickerSingleProps>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
    setIsOpen(!isOpen);
  };

  // Handle click outside to close calendar
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          triggerRef.current && 
          popupRef.current && 
          !triggerRef.current.contains(event.target as Node) && 
          !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Only add the event listener if the calendar is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);
  
  console.log("calendar", props, isOpen,position);
      return (
      <div className="relative flex items-center gap-2 border border-border rounded-lg p-2" ref={triggerRef} onClick={handleClick}>
      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      <span>
        {props.selected ? props.selected.toISOString().split('T')[0] : 'Select Date'}
      </span>
      {isOpen && createPortal(
        <div 
          ref={popupRef}
          className="fixed bg-background border border-border/30 rounded-lg shadow-xl p-4 cursor-pointer mb-2"
          style={{ 
            top: position.top + 1,
            left: position.left,
            minWidth: "120px",
            zIndex: 999999
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DayPicker
            {...props}
            animate
            mode={"single"}
            showOutsideDays={showOutsideDays}
            className={cn("p-1", className)}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-0 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                buttonVariants({ variant: "outline" }),
                "h-8 w-8 bg-background border border-border p-0 opacity-70 hover:opacity-100 hover:bg-accent"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
              ),
              day_range_start: "day-range-start",
              day_range_end: "day-range-end",
              day_selected:
                "bg-[var(--starithm-veronica)] text-white hover:bg-[var(--starithm-veronica)] hover:text-white focus:bg-[var(--starithm-veronica)] focus:text-white",
              day_today: "bg-[var(--starithm-veronica)] text-white",
              day_outside:
                "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
              ...classNames,
            }}
            components={{
              IconLeft: () => <ChevronLeft className="h-4 w-4" />,
              IconRight: () => <ChevronRight className="h-4 w-4" />
            }}
            navLayout="around"
            onSelect={(date: Date) => {
              // Convert the selected date to UTC midnight to ensure consistent timezone handling
              const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
              console.log("selected", date, utcDate)
              props.onSelect?.(utcDate);
              setIsOpen(false);
            }}
            
            
          />
        </div>,
        document.body
      )}

    </div>
    // <DayPicker
    //   showOutsideDays={showOutsideDays}
    //   className={cn("p-3", className)}
    //   classNames={{
    //     months: "flex flex-col sm:flex-row gap-2",
    //     month: "flex flex-col gap-4",
    //     caption: "flex justify-center pt-1 relative items-center w-full",
    //     caption_label: "text-sm font-medium",
    //     nav: "flex items-center gap-1",
    //     nav_button: cn(
    //       buttonVariants({ variant: "outline" }),
    //       "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
    //     ),
    //     nav_button_previous: "absolute left-1",
    //     nav_button_next: "absolute right-1",
    //     table: "w-full border-collapse space-x-1",
    //     head_row: "flex",
    //     head_cell:
    //       "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
    //     row: "flex w-full mt-2",
    //     cell: cn(
    //       "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
    //       props.mode === "range"
    //         ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
    //         : "[&:has([aria-selected])]:rounded-md",
    //     ),
    //     day: cn(
    //       buttonVariants({ variant: "ghost" }),
    //       "size-8 p-0 font-normal aria-selected:opacity-100",
    //     ),
    //     day_range_start:
    //       "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
    //     day_range_end:
    //       "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
    //     day_selected:
    //       "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
    //     day_today: "bg-accent text-accent-foreground",
    //     day_outside:
    //       "day-outside text-muted-foreground aria-selected:text-muted-foreground",
    //     day_disabled: "text-muted-foreground opacity-50",
    //     day_range_middle:
    //       "aria-selected:bg-accent aria-selected:text-accent-foreground",
    //     day_hidden: "invisible",
    //     ...classNames,
    //   }}
    //   components={{
    //     IconLeft: ({ className, ...props }) => (
    //       <ChevronLeft className={cn("size-4", className)} {...props} />
    //     ),
    //     IconRight: ({ className, ...props }) => (
    //       <ChevronRight className={cn("size-4", className)} {...props} />
    //     ),
    //   }}
    //   {...props}
    // />
  );
}

export { Calendar };
