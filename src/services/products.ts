import { supabase } from "@/lib/supabase";
import { AppError, NotFoundError } from "@/lib/errors";

export interface Product {
  id: string | number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  stock?: number;
  rating?: number;
  promo_end_date?: string;
  badge?: 'new' | 'hot' | 'sale' | 'limited';
}

// ---- Fallback mock data (used if Supabase is unreachable) ----
function generateFallbackProducts(): Product[] {
  const commonColors = ["#000000", "#16a34a", "#0d9488", "#dc2626", "#a21caf"];
  const commonSizes = ["M", "L", "XL", "XXL"];
  return [
    {
      id: 1,
      title: "Classic White Tee",
      price: 149,
      description: "Premium cotton t-shirt.",
      category: "men",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
      ],
      colors: ["#ffffff", "#000000"],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 2,
      title: "Summer Floral Dress",
      price: 399,
      description: "Lightweight summer dress.",
      category: "women",
      image:
        "https://images.unsplash.com/photo-1515347619152-16692cb58eb1?w=500&q=80",
      images: [
        "https://images.unsplash.com/photo-1515347619152-16692cb58eb1?w=500&q=80",
      ],
      colors: ["#ff0000", "#00ff00"],
      sizes: commonSizes,
    },
    {
      id: 3,
      title: "Denim Jacket",
      price: 599,
      description: "Vintage wash denim jacket.",
      category: "men",
      image:
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80",
      images: [
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80",
      ],
      colors: ["#1e3a8a", "#000000"],
      sizes: ["M", "L"],
    },
    {
      id: 4,
      title: "Elegant Evening Gown",
      price: 899,
      description: "Perfect for special occasions.",
      category: "women",
      image:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80",
      images: [
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80",
      ],
      colors: commonColors,
      sizes: commonSizes,
    },
    {
      id: 5,
      title: "Streetwear Hoodie",
      price: 349,
      description: "Oversized comfort hoodie.",
      category: "promotions",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
      ],
      colors: ["#000000", "#ffffff"],
      sizes: ["M", "L", "XL"],
    },
    {
      id: 6,
      title: "Tailored Trousers",
      price: 450,
      description: "Smart casual trousers.",
      category: "men",
      image:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
      ],
      colors: ["#1f2937", "#e5e7eb"],
      sizes: ["30", "32", "34", "36"],
    },
    {
      id: 7,
      title: "Silk Blouse",
      price: 299,
      description: "Smooth silk blend blouse.",
      category: "women",
      image:
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80",
      images: [
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80",
      ],
      colors: ["#ffffff", "#fecdd3"],
      sizes: commonSizes,
    },
    {
      id: 8,
      title: "Casual Sneakers",
      price: 499,
      description: "Everyday lifestyle sneakers.",
      category: "promotions",
      image:
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80",
      images: [
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80",
      ],
      colors: ["#ffffff", "#000000"],
      sizes: ["40", "41", "42", "43", "44"],
    },
    {
      id: 9,
      title: "Kardiguan Velour",
      price: 199,
      description: "Magnifique kardiguan en velours bleu.",
      category: "women",
      image: "/kardiguan.jpg",
      images: [
        "/kardiguan.jpg",
        "/kardiguan2.jpg",
        "/kardiguan3.jpg",
        "/kardiguan4.jpg",
        "/kardiguan5.jpg",
      ],
      colors: commonColors,
      sizes: commonSizes,
      badge: 'new'
    },
    {
      id: 10,
      title: "Junior Street Hoodie",
      price: 249,
      description: "Comfortable urban hoodie for boys.",
      category: "boys",
      image: "https://images.unsplash.com/photo-1519457431-758c4abb627f?w=500&q=80",
      images: [
        "https://images.unsplash.com/photo-1519457431-758c4abb627f?w=500&q=80",
      ],
      colors: ["#000000", "#1e3a8a"],
      sizes: ["S", "M", "L"],
      stock: 5,
      badge: 'hot'
    },
  ];
}

// ---- FETCH ALL PRODUCTS ----
export async function fetchProducts(category?: string): Promise<Product[]> {
  try {
    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("Supabase fetch error:", error.message);
      let products = generateFallbackProducts();
      if (category && category !== "all") {
        products = products.filter((p) => p.category === category);
      }
      return products;
    }

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    let products = generateFallbackProducts();
    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }
    return products;
  }
}

// ---- FETCH SINGLE PRODUCT ----
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.warn("Supabase fetch error:", error.message);
      const products = generateFallbackProducts();
      return products.find((p) => p.id.toString() === id) || null;
    }

    if (!data) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    return data as Product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    const products = generateFallbackProducts();
    return products.find((p) => p.id.toString() === id) || null;
  }
}

// ---- ADD PRODUCT ----
export async function addProduct(
  product: Omit<Product, "id">,
): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error("Error adding product:", error.message);
      return null;
    }
    return data as Product;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

// ---- UPDATE PRODUCT ----
export async function updateProduct(
  id: string | number,
  updates: Partial<Product>,
): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error.message);
      return null;
    }
    return data as Product;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
}

// ---- DELETE PRODUCT ----
export async function deleteProduct(id: string | number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", Number(id));

    if (error) {
      console.error("Error deleting product:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

// ---- CREATE ORDER ----
export async function createOrder(order: {
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  items: any[];
  total: number;
  user_id?: string;
}): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([{ ...order, status: "pending" }])
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
}
// ---- STOCK NOTIFICATIONS ----
export async function requestStockNotification(data: {
  product_id: string | number;
  phone: string;
  size?: string;
  color?: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("stock_notifications")
      .insert([data]);

    if (error) {
      console.error("Error creating notification:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
}
