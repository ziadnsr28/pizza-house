import { useEffect } from "react";

interface PriceModalProps {
  open: boolean;
  onClose: () => void;
  price: number;
}

/**
 * Simple modal for showing full pricing details.
 * Uses a fixed overlay with Tailwind transition utilities for a smooth fade-in/out.
 */
export default function PriceModal({ open, onClose, price }: PriceModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Modal content */}
      <div
        className="bg-card rounded-lg p-6 w-11/12 max-w-md shadow-xl transform transition-all duration-300 scale-95"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-foreground">Pricing Details</h2>
        <p className="text-lg font-semibold text-accent mb-2">
          Full Price: {price.toLocaleString("en-US", { style: "currency", currency: "EGP" })}
        </p>
        <p className="text-muted-foreground mb-4">Here you can list available plans, features, and any extra information.</p>
        {/* Placeholder for plan/options – replace with real data later */}
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
          <li>Standard Pizza – includes basic toppings</li>
          <li>Premium Pizza – includes premium toppings</li>
          <li>Family Pack – 2 Large + 2 Sides</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-2 w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
