# IlyWear - Developer Quick Reference

## 🚀 Getting Started

```bash
npm install              # Install dependencies
npm run dev              # Start dev server
npm run build           # Build for production
npm run lint            # Check code quality
```

---

## 📦 Importing Components

### UI Components

```tsx
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Modal } from "@/components/ui/Modal";
import { Alert, Badge } from "@/components/ui/Alert";
import {
  LoadingSpinner,
  LoadingSkeleton,
  PageLoading,
} from "@/components/ui/Loading";
```

### Feature Components

```tsx
import CartSidebar from "@/components/CartSidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
```

---

## 🎛️ Component Props

### Button

```tsx
<Button
  variant="primary" // primary, secondary, accent, outline, ghost
  size="md" // sm, md, lg
  isLoading={false} // Boolean
  icon={<Icon />} // React.ReactNode
  fullWidth={false} // Boolean
  disabled={false} // Boolean
>
  Click Me
</Button>
```

### Input

```tsx
<Input
  label="Email" // String
  type="email" // HTML input type
  error="Invalid email" // String | undefined
  helperText="Help text" // String | undefined
  required={true} // Boolean
  placeholder="..." // String
  onChange={handler} // Function
  value="" // String
/>
```

### Modal

```tsx
<Modal
  isOpen={true} // Boolean
  onClose={handleClose} // Function
  title="Dialog Title" // String
  size="md" // sm, md, lg
  closeButton={true} // Boolean
>
  Modal content here
</Modal>
```

### Alert

```tsx
<Alert
  variant="success" // success, error, warning, info
  title="Success" // String (optional)
  message="It worked!" // String (required)
  closeable={true} // Boolean
  onClose={handler} // Function
  action={{
    // Optional action button
    label: "Undo",
    onClick: () => {},
  }}
/>
```

### Badge

```tsx
<Badge
  variant="primary" // primary, secondary, success, error, warning, info
  size="md" // sm, md
>
  Label
</Badge>
```

### Loading

```tsx
// Skeleton
<LoadingSkeleton
  variant="card"             // card, text, circle, rectangle
  count={3}                  // Number of items
  width="w-full"             // Tailwind width
  height="h-4"               // Tailwind height
/>

// Spinner
<LoadingSpinner
  size="md"                  // sm, md, lg
  fullScreen={false}         // Boolean
  text="Loading..."          // String
/>

// Full page loading
<PageLoading text="Loading..." />
```

---

## 🎣 Using Hooks

### useAsync

```tsx
import { useAsync } from "@/hooks";

// In component
const { status, data, error, execute } = useAsync(
  async () => {
    const response = await fetch("/api/data");
    return response.json();
  },
  true, // immediate execution
);

// Check status
if (status === "loading") return <LoadingSpinner />;
if (status === "error")
  return <Alert variant="error" message={error?.message} />;
if (status === "success") return <div>{data}</div>;
```

### useFetch

```tsx
import { useFetch } from "@/hooks";

const { status, data, error } = useFetch(
  query ? `/api/search?q=${query}` : null, // null to skip
);
```

### useForm

```tsx
import { useForm } from "@/hooks";

const {
  values, // Form values object
  errors, // Error messages object
  touched, // Which fields were touched
  isSubmitting, // Is form being submitted
  handleChange, // Input change handler
  handleBlur, // Input blur handler
  handleSubmit, // Form submit handler
  setFieldValue, // Set field value
  setFieldError, // Set field error
  resetForm, // Reset form
} = useForm({
  initialValues: { email: "", password: "" },
  onSubmit: async (values) => {
    // Handle submission
  },
});

// In JSX
<form onSubmit={handleSubmit}>
  <Input
    name="email"
    value={values.email}
    error={errors.email}
    onChange={handleChange}
    onBlur={handleBlur}
  />
  <Input
    name="password"
    type="password"
    value={values.password}
    error={errors.password}
    onChange={handleChange}
  />
  <Button type="submit" isLoading={isSubmitting}>
    Login
  </Button>
</form>;
```

### usePagination

```tsx
import { usePagination } from '@/hooks';

const {
  currentPage,    // Number
  totalPages,     // Number
  startIndex,     // Number
  endIndex,       // Number
  hasNextPage,    // Boolean
  hasPrevPage,    // Boolean
  goToPage,       // Function
  nextPage,       // Function
  prevPage,       // Function
} = usePagination({
  totalItems: 100,
  itemsPerPage: 10,
  maxPages: 5
});

// Show items
const items = allItems.slice(startIndex, endIndex);

// Navigation
<button onClick={prevPage} disabled={!hasPrevPage}>
  Previous
</button>
<button onClick={nextPage} disabled={!hasNextPage}>
  Next
</button>
```

### useLocalStorage

```tsx
import { useLocalStorage } from "@/hooks";

const [value, setValue, isLoaded] = useLocalStorage<string>(
  "key",
  "defaultValue",
);

// Use like state
setValue("newValue");
setValue((prev) => prev + "!");

// Check if loaded
if (!isLoaded) return <LoadingSpinner />;
```

### useDebounce

```tsx
import { useDebounce } from "@/hooks";

const [query, setQuery] = useState("");
const debouncedQuery = useDebounce(query, 300);

useEffect(() => {
  // This effect runs after user stops typing
  searchProducts(debouncedQuery);
}, [debouncedQuery]);
```

---

## 🔧 Using Context

### Cart

```tsx
import { useCart } from "@/context/CartContext";

const {
  cart, // CartItem[]
  addToCart, // Function
  removeFromCart, // Function
  updateQuantity, // Function
  clearCart, // Function
  cartCount, // Number
  cartTotal, // Number
  isCartOpen, // Boolean
  setIsCartOpen, // Function
} = useCart();

addToCart(product, quantity, size, color);
removeFromCart(productId, size, color);
updateQuantity(productId, newQuantity, size, color);
```

### Wishlist

```tsx
import { useWishlist } from "@/context/WishlistContext";

const {
  wishlist, // WishlistItem[]
  addToWishlist, // Function
  removeFromWishlist, // Function
  toggleWishlist, // Function
  isWishlisted, // Function
  clearWishlist, // Function
  wishlistCount, // Number
} = useWishlist();

toggleWishlist(product);
addToWishlist(productId);
removeFromWishlist(productId);
```

### Toast

```tsx
import { useToast } from "@/context/ToastContext";

const { showToast } = useToast();

showToast("Success message", "success");
showToast("Error message", "error");
showToast("Info message", "info");
showToast("Warning message", "warning", 5000); // 5 second duration
```

### Language

```tsx
import { useLanguage } from "@/context/LanguageContext";

const {
  language, // 'en' | 'fr' | 'ar'
  setLanguage, // Function
  t, // Translation function
  isRTL, // Boolean (for RTL languages)
} = useLanguage();

<div dir={isRTL ? "rtl" : "ltr"}>{t("home")} // Translate key</div>;
```

---

## 📚 Validation

### Validate Single Field

```tsx
import { validateField } from "@/lib/validation";

const error = validateField("user@example.com", {
  required: true,
  email: true,
  minLength: [5, "At least 5 characters"],
  maxLength: [100, "Max 100 characters"],
  pattern: [/^[a-z]/i, "Must start with letter"],
  custom: (value) => {
    if (value.includes("admin")) return "Cannot use admin";
    return true;
  },
});

// error is string or null
```

### Validate Form

```tsx
import { validateForm } from "@/lib/validation";

const errors = validateForm(
  { email: "user@example.com", password: "123" },
  {
    email: { required: true, email: true },
    password: { required: true, minLength: 8 },
  },
);

// errors is ValidationError[] array
```

### Specialized Validators

```tsx
import {
  validatePhoneNumber, // Morocco format
  validatePasswordStrength,
  validateUrl,
  validateDateRange,
} from "@/lib/validation";

validatePhoneNumber("+212600000000"); // Boolean
validatePasswordStrength("Pass123!"); // { score, feedback }
validateUrl("https://example.com"); // Boolean
validateDateRange(start, end); // Boolean
```

---

## 🛠️ Utilities

### Formatting

```tsx
import {
  formatCurrency,
  formatDate,
  truncateText,
  capitalize,
  generateSlug,
} from "@/lib/utils";

formatCurrency(500, "MAD"); // "500 MAD"
formatDate(new Date()); // "January 15, 2024"
truncateText("Long text...", 10); // "Long t..."
capitalize("hello"); // "Hello"
generateSlug("Hello World"); // "hello-world"
```

### Performance

```tsx
import { debounce, throttle, sleep } from "@/lib/utils";

// Debounce - useful for search, resize
const debouncedSearch = debounce((query) => {
  searchProducts(query);
}, 300);

// Throttle - useful for scroll
const throttledScroll = throttle(() => {
  checkInView();
}, 100);

// Sleep - delay execution
await sleep(1000); // Wait 1 second
```

### Object Utilities

```tsx
import { deepClone, isEqual } from "@/lib/utils";

const copy = deepClone(object); // Deep copy
isEqual(obj1, obj2); // Deep comparison
```

### Query Utilities

```tsx
import { getQueryParams, buildQueryString } from "@/lib/utils";

const params = getQueryParams("?page=1&filter=active"); // Object
const query = buildQueryString({ page: 1, filter: "active" }); // String
```

---

## 🔐 Error Handling

### Custom Errors

```tsx
import {
  AppError,
  ValidationError,
  NotFoundError,
  AuthError,
  handleAsync,
} from "@/lib/errors";

// Throw custom errors
throw new ValidationError("Invalid input", { field: "email" });
throw new NotFoundError("Product not found");
throw new AuthError("Not authenticated");

// Handle async operations
const result = await handleAsync(async () => {
  return await fetchData();
});

if (!result.success) {
  console.error(result.error.message);
  console.error(result.error.code);
  console.error(result.error.statusCode);
}
```

### Logging

```tsx
import { logger } from "@/lib/logger";

logger.debug("Debug info", { data });
logger.info("Something happened");
logger.warn("Warning: be careful");
logger.error("Error occurred", error);

// Get logs
const recentErrors = logger.getLogs("error", 50);
const logJson = logger.exportLogs(); // For export/backup
logger.clearLogs();
```

---

## 🎨 Styling

### Tailwind Classes

```tsx
// Animations (custom)
className = "animate-fade-in animate-slide-up animate-scale-in";

// Delays
className = "delay-100 delay-200 delay-300";

// Utilities
className = "line-clamp-3 touch-none backdrop-blur-xl";

// Responsive
className = "w-full sm:w-1/2 md:w-1/3 lg:w-1/4";
```

### Custom CSS

All animations defined in `src/app/globals.css`:

- `fade-in`
- `slide-up`, `slide-down`, `slide-left`, `slide-right`
- `scale-in`
- `pulse-slow`
- `shimmer`
- `bounce-light`
- `marquee`

---

## 📋 Configuration

### App Config

```tsx
import { APP_CONFIG } from "@/lib/config";

APP_CONFIG.name; // 'IlyWear'
APP_CONFIG.api.timeout; // 30000ms
APP_CONFIG.cart.maxQuantity; // 100
APP_CONFIG.pagination.size; // 12
APP_CONFIG.ui.toastDuration; // 3000ms
APP_CONFIG.features.wishlist; // true
```

### Constants

```tsx
import {
  CATEGORIES,
  PAYMENT_METHODS,
  CITIES,
  CONTACT_METHODS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "@/lib/constants";

CATEGORIES; // [{id, label, slug}, ...]
PAYMENT_METHODS; // [{id, label, icon}, ...]
CITIES; // ['Casablanca', 'Fez', ...]
ERROR_MESSAGES; // { NETWORK_ERROR: '...' }
SUCCESS_MESSAGES; // { ADDED_TO_CART: '...' }
```

---

## 📁 Common Files Location

| Item          | Location                |
| ------------- | ----------------------- |
| Components    | `src/components/`       |
| UI Components | `src/components/ui/`    |
| Hooks         | `src/hooks/index.ts`    |
| Types         | `src/lib/types.ts`      |
| Utilities     | `src/lib/utils.ts`      |
| Validation    | `src/lib/validation.ts` |
| Errors        | `src/lib/errors.ts`     |
| Logger        | `src/lib/logger.ts`     |
| Config        | `src/lib/config.ts`     |
| Constants     | `src/lib/constants.ts`  |
| Services      | `src/services/`         |
| Context       | `src/context/`          |
| Pages         | `src/app/`              |

---

## ✅ Common Tasks

### Add a New Page

1. Create `src/app/page-name/page.tsx`
2. Export React component
3. Add navigation link in Header

### Add a New Component

1. Create `src/components/ComponentName.tsx`
2. Export from `src/components/index.ts`
3. Use in pages

### Add Form Validation

```tsx
const errors = validateForm(data, {
  fieldName: { required: true, minLength: 5 },
});
```

### Handle Async Data

```tsx
const { status, data, error } = useFetch("/api/endpoint");
```

### Create Custom Hook

```tsx
export function useMyHook(initialValue) {
  const [state, setState] = useState(initialValue);
  // Logic here
  return { state, setState };
}
```

---

## 🐛 Debugging

### React DevTools

- Inspect components
- View props and state
- Track renders
- Profile performance

### Browser Console

```javascript
// Test API
fetch("/api/products")
  .then((r) => r.json())
  .then(console.log);
```

### Logging

```tsx
logger.error("Debug message", { data });
const logs = logger.getLogs("error", 50);
```

---

## 🔗 Quick Links

- 📖 [Full Documentation](PROJECT_DOCUMENTATION.md)
- ⚙️ [Setup Guide](SETUP_GUIDE.md)
- 👨‍💻 [Development Guide](DEVELOPMENT_GUIDE.md)
- 🔐 [Security Guide](SECURITY_GUIDE.md)
- 📊 [Upgrade Summary](UPGRADE_SUMMARY.md)

---

**Happy coding! 🚀**
