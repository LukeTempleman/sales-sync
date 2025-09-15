import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Simple dropdown menu implementation using React state
const DropdownMenuContext = React.createContext({
  open: false,
  setOpen: () => {},
  triggerRef: null,
  contentRef: null,
});

const DropdownMenu = ({ children }) => {
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
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext);

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
      aria-haspopup="menu"
      className={className}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => {
  const { open, contentRef } = React.useContext(DropdownMenuContext);

  if (!open) return null;

  return (
    <div
      ref={(node) => {
        // Handle both refs
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
        contentRef.current = node;
      }}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
      style={{ marginTop: sideOffset }}
      role="menu"
      {...props}
    />
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(({ className, inset, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    setOpen(false);
  };

  return (
    <button
      ref={ref}
      role="menuitem"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        inset && "pl-8",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, onCheckedChange, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext);
  const [isChecked, setIsChecked] = useState(checked || false);

  useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);

  const handleClick = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onCheckedChange) onCheckedChange(newValue);
    setOpen(false);
  };

  return (
    <button
      ref={ref}
      role="menuitemcheckbox"
      aria-checked={isChecked}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isChecked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </button>
  );
});
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioGroup = ({ children, value, onValueChange }) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div role="group">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === selectedValue,
            onCheckedChange: () => handleValueChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";

const DropdownMenuRadioItem = React.forwardRef(({ className, children, value, checked, onCheckedChange, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext);

  const handleClick = () => {
    if (onCheckedChange) onCheckedChange(true);
    setOpen(false);
  };

  return (
    <button
      ref={ref}
      role="menuitemradio"
      aria-checked={checked}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Circle className="h-2 w-2 fill-current" />}
      </span>
      {children}
    </button>
  );
});
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    role="separator"
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// Simplified versions of the sub-menu components
const DropdownMenuGroup = ({ className, ...props }) => (
  <div className={cn("flex flex-col gap-1", className)} role="group" {...props} />
);
DropdownMenuGroup.displayName = "DropdownMenuGroup";

// These components are simplified and don't have full functionality
const DropdownMenuSub = DropdownMenu;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent hover:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </button>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = DropdownMenuContent;
const DropdownMenuPortal = ({ children }) => children;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};