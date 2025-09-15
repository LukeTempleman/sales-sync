import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';

// Simple popover implementation using React state
const PopoverContext = React.createContext({
  open: false,
  setOpen: () => {},
  triggerRef: null,
  contentRef: null,
});

const Popover = ({ children }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        contentRef.current &&
        !contentRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      {children}
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = React.useContext(PopoverContext);

  return (
    <button
      ref={(node) => {
        // Handle both refs
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
        triggerRef.current = node;
      }}
      type="button"
      aria-expanded={open}
      aria-haspopup="dialog"
      className={className}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const { open, contentRef } = React.useContext(PopoverContext);

  if (!open) return null;

  // Simple alignment logic
  const getAlignmentStyle = () => {
    switch (align) {
      case "start":
        return { left: 0 };
      case "end":
        return { right: 0 };
      case "center":
      default:
        return { left: '50%', transform: 'translateX(-50%)' };
    }
  };

  return (
    <div
      ref={(node) => {
        // Handle both refs
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
        contentRef.current = node;
      }}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none absolute",
        className
      )}
      style={{ 
        marginTop: sideOffset,
        ...getAlignmentStyle()
      }}
      role="dialog"
      {...props}
    />
  );
});
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };