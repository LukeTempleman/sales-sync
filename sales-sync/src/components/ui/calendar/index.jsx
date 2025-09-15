import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../button';

// Simple calendar component that doesn't rely on react-day-picker
function Calendar({ className, selected, onSelect, ...props }) {
  const [currentDate, setCurrentDate] = useState(selected || new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    if (onSelect) {
      onSelect(newDate);
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  const isSelected = (day) => {
    if (!selected) return false;
    return day === selected.getDate() && 
           currentMonth === selected.getMonth() && 
           currentYear === selected.getFullYear();
  };

  // Generate calendar days
  const calendarDays = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <button
        key={`day-${day}`}
        onClick={() => handleDateClick(day)}
        className={cn(
          "h-9 w-9 rounded-md text-sm p-0 font-normal flex items-center justify-center",
          isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          isToday(day) && !isSelected(day) && "bg-accent text-accent-foreground",
          !isSelected(day) && !isToday(day) && "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {day}
      </button>
    );
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex justify-center pt-1 relative items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="absolute left-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button
          onClick={handleNextMonth}
          className="absolute right-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex w-full">
        {dayNames.map((day) => (
          <div key={day} className="h-9 w-9 text-center text-muted-foreground text-xs flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 mt-1">
        {calendarDays}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };