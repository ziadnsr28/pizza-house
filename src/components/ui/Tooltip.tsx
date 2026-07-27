import { useState, useCallback, ReactNode, FC } from "react";

interface TooltipProps {
  /** Content shown inside the tooltip */
  content: string;
  /** Element that triggers the tooltip */
  children: ReactNode;
}

/**
 * Lightweight accessible tooltip.
 * - Shows on hover and focus (desktop).
 * - Shows on tap/click (mobile) – toggles visibility.
 * - Falls back to native title attribute for screen‑readers.
 */
const Tooltip: FC<TooltipProps> = ({ content, children }) => {
  const [open, setOpen] = useState(false);

  const openTooltip = useCallback(() => setOpen(true), []);
  const closeTooltip = useCallback(() => setOpen(false), []);
  const toggleTooltip = useCallback(() => setOpen((v) => !v), []);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
      onFocus={openTooltip}
      onBlur={closeTooltip}
      onClick={toggleTooltip}
      // Native fallback for accessibility
      title={content}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max max-w-xs rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg z-10 whitespace-nowrap"
        >
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
