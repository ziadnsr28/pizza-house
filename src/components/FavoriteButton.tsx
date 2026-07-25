/**
 * FavoriteButton Component
 *
 * What it does:
 * Renders an animated heart button that toggles favorite status for a given pizza ID.
 * Features Framer Motion spring scale animations and Sonner toast notifications.
 *
 * Where it belongs:
 * src/components/FavoriteButton.tsx
 */

"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useFavoriteStore } from "@/stores/favorite-store";
import { cn } from "@/lib/utils";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export interface FavoriteButtonProps {
  pizzaId: string;
  pizzaName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function FavoriteButton({
  pizzaId,
  pizzaName = "Pizza",
  size = "md",
  className,
}: FavoriteButtonProps) {
  const isClient = useIsClient();
  const { isFavorite, toggleFavorite } = useFavoriteStore();

  const active = isClient ? isFavorite(pizzaId) : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleFavorite(pizzaId);

    if (!active) {
      toast.success(`Saved to Favorites! ❤️`, {
        description: `${pizzaName} has been added to your favorites list.`,
      });
    } else {
      toast.info(`Removed from Favorites`, {
        description: `${pizzaName} has been removed from your favorites.`,
      });
    }
  };

  const sizeStyles = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
      aria-label={active ? `Remove ${pizzaName} from favorites` : `Add ${pizzaName} to favorites`}
      className={cn(
        "flex items-center justify-center rounded-full border border-border/60 bg-card/80 backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary shadow-md",
        active
          ? "border-red-500/50 bg-red-500/10 text-red-500"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        sizeStyles[size],
        className
      )}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-all duration-300",
          active ? "fill-red-500 text-red-500 scale-110" : ""
        )}
      />
    </motion.button>
  );
}
