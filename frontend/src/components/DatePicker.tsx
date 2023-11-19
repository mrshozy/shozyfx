import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { isWeekend } from 'date-fns/fp';

interface DatePickerProps {
  date: Date | undefined,
  onChange : (date: Date | undefined) => void
  disabled?: boolean
  className?: string
}

const DatePicker: React.FC<DatePickerProps> = ({date, onChange, disabled, className}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground", className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01") || isWeekend(date)
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
};

export default DatePicker;
