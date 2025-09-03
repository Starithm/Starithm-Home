"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, PropsSingle as DayPickerSingleProps } from "react-day-picker";


import { cn } from "../../utils/cn";
import { buttonVariants } from "./button";

type CalendarProps = React.ComponentProps<typeof DayPicker & DayPickerSingleProps> & {
  triggerClassName?: string;
  placeholder?: string;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  triggerClassName,
  placeholder = 'Select Date',
  ...props
}: CalendarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
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
      <div
        role="button"
        tabIndex={0}
        ref={triggerRef}
        onClick={handleClick}
        className={cn(
          "relative flex h-10 w-full min-w-2 items-center gap-2 rounded-lg border border-border px-6 py-2 text-base bg-background dark:bg-starithm-bg-black transition-[color,box-shadow] outline-none cursor-pointer",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          triggerClassName,
        )}
      >
      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">
        {props.selected ? props.selected.toISOString().split('T')[0] : placeholder}
      </span>
      {isOpen && createPortal(
        <div 
          ref={popupRef}
          className="fixed bg-background border border-border/30 rounded-lg shadow-xl p-6 cursor-pointer mb-2"
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
  );
}

export { Calendar };
