/**
 * Global app configuration
 */

export const APP_CONFIG = {
  name: "IlyWear",
  tagline: "Premium Moroccan Streetwear",
  description:
    "Premium Moroccan streetwear designed for the bold. Experience comfort without compromise.",

  // API & External Services
  api: {
    timeout: 30000,
    retries: 3,
  },

  // Cart
  cart: {
    maxQuantityPerItem: 100,
  },

  // Pagination
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100,
  },

  // Search & Filters
  search: {
    minChars: 2,
    debounceMs: 300,
  },

  // UI
  ui: {
    toastDuration: 3000,
    animationDuration: 300,
  },

  // Feature Flags
  features: {
    wishlist: true,
    reviews: true,
    orders: true,
    admin: true,
  },
};

export const CATEGORIES = [
  { id: "all", label: "All Products", slug: "all" },
  { id: "men", label: "Men", slug: "men" },
  { id: "women", label: "Women", slug: "women" },
  { id: "promotions", label: "Promotions", slug: "promotions" },
];

export const PAYMENT_METHODS = [
  { id: "cash", label: "Cash on Delivery", icon: "DollarSign" },
  { id: "card", label: "Credit/Debit Card", icon: "CreditCard" },
  { id: "bank_transfer", label: "Bank Transfer", icon: "Bank" },
];

export const CITIES = [
  "Casablanca",
  "Fez",
  "Marrakech",
  "Rabat",
  "Tangier",
  "Agadir",
  "Meknes",
  "Tétouan",
  "Oujda",
  "Kenitra",
  "Sale",
  "Fes El Bali",
];

export const CONTACT_METHODS = {
  whatsapp: "+212600000000",
  email: "support@ilywear.com",
  phone: "+212600000000",
};
