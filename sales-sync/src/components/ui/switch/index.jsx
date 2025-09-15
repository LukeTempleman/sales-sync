import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';

const Switch = React.forwardRef(({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);

  const handleChange = () => {
    if (disabled) return;
    
    const newValue = !isChecked;
    setIsChecked(newValue);
    
    if (onCheckedChange) {
      onCheckedChange(newValue);
    }
  };

  return (
    <div
      ref={ref}
      role="switch"
      aria-checked={isChecked}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        isChecked ? "bg-primary" : "bg-input",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleChange();
        }
      }}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          isChecked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </div>
  );
});

Switch.displayName = "Switch";

export { Switch };