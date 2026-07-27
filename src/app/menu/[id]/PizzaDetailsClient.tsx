/**
 * Pizza Details Page Client Component Container
 *
 * What it does:
 * Handles client-side options selection (size, toppings, quantity),
 * live price calculations, adding items to the Zustand cart store,
 * customer reviews section, and related pizzas recommendations.
 *
 * Where it belongs:
 * src/app/menu/[id]/PizzaDetailsClient.tsx
 */

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, CheckCircle2, ShieldCheck, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/QuantitySelector";
import PizzaOptions, { PizzaSize, AVAILABLE_TOPPINGS, SIZE_OPTIONS } from "@/components/PizzaOptions";
import ReviewsSection from "@/components/ReviewsSection";
import PizzaCard from "@/components/PizzaCard";
import FavoriteButton from "@/components/FavoriteButton";
import { FULL_MENU_PIZZAS, PizzaProduct } from "@/constants/landing-data";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

export interface PizzaDetailsClientProps {
  pizza: PizzaProduct;
}

export default function PizzaDetailsClient({ pizza }: PizzaDetailsClientProps) {
  const addItem = useCartStore((state) => state.addItem);

  /** Interactive options state */
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("Medium");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  /** Related pizzas from same category or fallback */
  const relatedPizzas = useMemo(() => {
    const sameCat = FULL_MENU_PIZZAS.filter(
      (p) => p.category === pizza.category && p.id !== pizza.id
    );
    if (sameCat.length > 0) return sameCat.slice(0, 3);
    return FULL_MENU_PIZZAS.filter((p) => p.id !== pizza.id).slice(0, 3);
  }, [pizza.category, pizza.id]);

  /** Toggle topping selection */
  const handleToppingToggle = (toppingName: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingName)
        ? prev.filter((t) => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  /** Calculate unit price based on base price, size multiplier, and topping add-ons */
  const unitPrice = useMemo(() => {
    const sizeMultiplier =
      SIZE_OPTIONS.find((opt) => opt.size === selectedSize)?.priceMultiplier || 1.0;
    const baseSizePrice = pizza.price * sizeMultiplier;

    const toppingsAddonPrice = selectedToppings.reduce((total, toppingName) => {
      const found = AVAILABLE_TOPPINGS.find((t) => t.name === toppingName);
      return total + (found ? found.price : 0);
    }, 0);

    return Math.round((baseSizePrice + toppingsAddonPrice) * 100) / 100;
  }, [pizza.price, selectedSize, selectedToppings]);

  /** Total price = unit price * quantity */
  const totalPrice = useMemo(() => {
    return Math.round(unitPrice * quantity * 100) / 100;
  }, [unitPrice, quantity]);

  /** Add item to Zustand cart store */
  const handleAddToCart = () => {
    addItem({
      pizzaId: pizza.id,
      name: pizza.name,
      basePrice: pizza.price,
      price: unitPrice,
      image: pizza.image,
      size: selectedSize,
      toppings: selectedToppings,
      quantity,
    });

    toast.success(`${pizza.name} (${selectedSize}) added to cart!`, {
      description: `${quantity} × ${formatPrice(unitPrice)}`,
    });

    // Show temporary feedback toast/badge
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 2500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-8 flex justify-between items-center">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Link href="/menu" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Full Menu
          </Link>
        </Button>

        <FavoriteButton pizzaId={pizza.id} pizzaName={pizza.name} size="md" />
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
        
        {/* Left Column: Hero Pizza Image */}
        <div className="lg:col-span-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-[36px] border border-border/60 bg-card/40 shadow-2xl backdrop-blur-md">
            <Image
              src={pizza.image}
              alt={pizza.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {pizza.badge && (
              <span className="absolute top-4 right-4 rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
                {pizza.badge}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Details & Customization Options */}
        <div className="flex flex-col gap-8 lg:col-span-6">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                {pizza.category} Pizza
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                Handcrafted Fresh Daily
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {pizza.name}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {pizza.description}
            </p>
          </div>

          {/* Customization Options (Size & Extra Toppings) */}
          <PizzaOptions
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            selectedToppings={selectedToppings}
            onToppingToggle={handleToppingToggle}
          />

          {/* Quantity & Add to Cart Footer */}
          <div className="mt-4 flex flex-col gap-6 pt-6 border-t border-border/50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Total Price</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-accent">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Quantity Selector */}
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => q + 1)}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                size="lg"
              />
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full gap-2.5 text-base font-bold shadow-xl shadow-primary/25 h-14 rounded-2xl"
            >
              {showAddedFeedback ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart — {formatPrice(totalPrice)}
                </>
              )}
            </Button>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16">
        <ReviewsSection pizzaId={pizza.id} />
      </div>

      {/* Related Pizzas Section */}
      {relatedPizzas.length > 0 && (
        <div className="mt-20 pt-10 border-t border-border/50">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">You Might Also Like</h3>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPizzas.map((relPizza) => (
              <PizzaCard key={relPizza.id} pizza={relPizza} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
