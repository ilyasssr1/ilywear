"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";
import Link from "next/link";

export default function CartSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } =
    useCart();
  const { showToast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setShouldRender(true);
    } else {
      document.body.style.overflow = "unset";
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // match transition duration
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleRemoveItem = (
    id: string | number,
    size?: string,
    color?: string,
  ) => {
    try {
      removeFromCart(id, size, color);
      showToast("Item removed from cart", "info");
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to remove item";
      setError(message);
      showToast(message, "error");
    }
  };

  const handleUpdateQuantity = (
    id: string | number,
    newQty: number,
    size?: string,
    color?: string,
  ) => {
    try {
      if (newQty < 1) return;
      updateQuantity(id, newQty, size, color);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update quantity";
      setError(message);
      showToast(message, "error");
    }
  };

  if (!isMounted) return null;
  if (!shouldRender) return null;

  return (
    <div className="relative z-[100]">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-500 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        role="presentation"
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart sidebar"
        aria-modal="true"
        style={{ backgroundColor: "#ffffff", height: "100vh" }}
      >
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight italic">
              YOUR BAG
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              {cartCount} {cartCount === 1 ? "Item" : "Items"} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex-shrink-0 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Free Shipping Highlight */}
        <div className="px-6 py-2.5 bg-black text-white flex items-center justify-between flex-shrink-0">
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">
            FREE SHIPPING
          </span>
          <span className="text-[9px] font-bold opacity-60 uppercase italic">
            Morocco Nationwide
          </span>
        </div>

        {/* Cart Items - Flex Grow to fill space */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide bg-white">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-white">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-gray-200" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight italic mb-2">
                BAG IS EMPTY
              </h3>
              <p className="text-gray-400 text-[11px] font-medium max-w-[180px] mb-8">
                Your luxury selection will appear here.
              </p>
              <button
                onClick={onClose}
                className="bg-black text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all"
              >
                Discover Products
              </button>
            </div>
          ) : (
            <div className="space-y-4 bg-white">
              {cart.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-4 items-center min-h-[120px]"
                >
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/product/${item.id}`}
                        onClick={onClose}
                        className="text-[11px] font-black uppercase tracking-tight text-black hover:text-accent transition-colors truncate pr-2"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() =>
                          handleRemoveItem(
                            item.id,
                            item.selectedSize,
                            item.selectedColor,
                          )
                        }
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Size and Color */}
                    <div className="flex items-center gap-2 text-[9px] text-gray-500">
                      {item.selectedSize && <span>{item.selectedSize}</span>}
                      {item.selectedColor && (
                        <div
                          className="w-3 h-3 rounded-full border border-gray-100"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                      )}
                    </div>

                    {/* Quantity Controls and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.quantity - 1,
                              item.selectedSize,
                              item.selectedColor,
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center bg-white border border-gray-100 rounded hover:bg-black hover:text-white transition-all text-gray-400 disabled:opacity-50"
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span
                          className="text-[10px] font-black text-black min-w-[12px] text-center"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.selectedSize,
                              item.selectedColor,
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center bg-white border border-gray-100 rounded hover:bg-black hover:text-white transition-all text-gray-400"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <div className="text-xs font-black italic text-black">
                        {item.price * item.quantity} MAD
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Section */}
        {cart.length > 0 && (
          <div className="p-8 border-t border-gray-100 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.03)] flex-shrink-0">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  SUBTOTAL
                </span>
                <span className="text-xl font-black italic tracking-tighter text-black">
                  {cartTotal} MAD
                </span>
              </div>

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-black text-white py-5 px-8 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent hover:text-black transition-all shadow-xl shadow-black/10"
                >
                  CHECKOUT NOW
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={onClose}
                  className="w-full text-center text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors py-2"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
