/**
 * ProductTable Component
 *
 * What it does:
 * Renders a table of pizza products with thumbnail image, category badge, formatted price,
 * and Edit / Delete actions.
 *
 * Where it belongs:
 * src/components/admin/ProductTable.tsx
 */

"use client";

import Image from "next/image";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PizzaProduct } from "@/constants/landing-data";
import { formatPrice } from "@/lib/utils";

export interface ProductTableProps {
  products: PizzaProduct[];
  onEdit: (product: PizzaProduct) => void;
  onDelete: (productId: string) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border/40 text-xs font-semibold text-muted-foreground uppercase bg-muted/20">
            <th className="py-3.5 px-4">Item</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Price</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-muted/30 transition-colors">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">{product.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                      {product.description}
                    </span>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {product.category}
                </span>
              </td>

              <td className="py-3.5 px-4 font-bold text-accent">
                {formatPrice(product.price)}
              </td>

              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product)}
                    className="h-8 w-8 p-0 rounded-lg"
                    aria-label={`Edit ${product.name}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    className="h-8 w-8 p-0 rounded-lg"
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-xs text-muted-foreground">
                No products found in database.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
