"use client";

import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface DateTimeFieldProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function DateTimeField({
  value,
  onChange,
  label,
  disabled,
  className,
}: DateTimeFieldProps) {
  const formatDateTime = (date: Date | null | undefined): string => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!newValue) {
      onChange?.(null);
      return;
    }

    const newDate = new Date(newValue);
    if (!isNaN(newDate.getTime())) {
      onChange?.(newDate);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Input
        type="datetime-local"
        value={formatDateTime(value)}
        onChange={handleChange}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}
