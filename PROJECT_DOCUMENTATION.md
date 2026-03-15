# IlyWear - Premium Moroccan Streetwear E-Commerce Platform

## Project Overview

IlyWear is a modern, professional e-commerce platform built with Next.js, React, TypeScript, and Tailwind CSS. It features a sophisticated architecture with comprehensive error handling, type safety, and user experience enhancements designed for a premium shopping experience.

### Key Features

- ✨ **Modern UI/UX**: Responsive, animated, and accessible interface
- 🛒 **Advanced Cart System**: Real-time cart management with localStorage persistence
- ❤️ **Wishlist Management**: Save favorite products
- 🔐 **Authentication**: Supabase-based user authentication
- 📦 **Product Management**: Dynamic product loading from Supabase
- 🎨 **Customization**: Color and size selection
- 📱 **Mobile-First**: Fully responsive design
- ♿ **Accessibility**: WCAG 2.1 AA compliant
- ⚡ **Performance**: Optimized for speed and efficiency
- 🛡️ **Error Handling**: Comprehensive error boundaries and logging

---

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (pages)/           # Page components
│   ├── globals.css        # Global styles with animations
│   ├── layout.tsx         # Root layout with providers
│   ├── error.tsx          # Error page
│   └── not-found.tsx      # 404 page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Alert.tsx
│   │   ├── Loading.tsx
│   │   └── TextArea.tsx
│   ├── CartSidebar.tsx
│   ├── ErrorBoundary.tsx
│   ├── SEO.tsx
│   └── ...
├── context/              # React Context providers
│   ├── CartContext.tsx
│   ├── ToastContext.tsx
│   ├── WishlistContext.tsx
│   └── LanguageContext.tsx
├── hooks/               # Custom React hooks
│   └── index.ts        # useAsync, useFetch, useForm, etc.
├── lib/                # Utilities and helpers
│   ├── types.ts        # TypeScript type definitions
│   ├── errors.ts       # Error handling utilities
│   ├── validation.ts   # Form validation
│   ├── utils.ts        # Common utilities
│   ├── logger.ts       # Logging system
│   ├── config.ts       # Configuration
│   └── constants.ts    # Global constants
└── services/           # API/Database services
    └── products.ts     # Product service
```

---

## Technology Stack

| Category             | Technologies                     |
| -------------------- | -------------------------------- |
| **Frontend**         | React 18, Next.js 14, TypeScript |
| **Styling**          | Tailwind CSS, PostCSS            |
| **State Management** | React Context API                |
| **Backend**          | Supabase (PostgreSQL)            |
| **Authentication**   | Supabase Auth                    |
| **Icons**            | Lucide React                     |
| **Animation**        | Framer Motion, CSS Animations    |
| **Forms**            | Custom hooks & context           |
| **Validation**       | Custom validation library        |

---

## Core Components & Utilities

### UI Components (`src/components/ui/`)

#### Button Component

```tsx
import Button from "@/components/ui/Button";

<Button variant="primary" size="lg" isLoading={false}>
  Click Me
</Button>;
```

- **Variants**: `primary`, `secondary`, `accent`, `outline`, `ghost`
- **Sizes**: `sm`, `md`, `lg`
- **Props**: `fullWidth`, `isLoading`, `icon`, `disabled`

#### Input Component

```tsx
import Input from "@/components/ui/Input";

<Input
  label="Email"
  type="email"
  error={error}
  required
  helperText="We'll never share your email"
/>;
```

#### Modal Component

```tsx
import { Modal } from "@/components/ui/Modal";

<Modal isOpen={isOpen} onClose={onClose} title="Confirm Action">
  Content here
</Modal>;
```

#### Alert Component

```tsx
import { Alert } from "@/components/ui/Alert";

<Alert
  variant="success"
  title="Success!"
  message="Your action was successful"
  closeable
/>;
```

#### Loading Component

```tsx
import { LoadingSpinner, PageLoading } from '@/components/ui/Loading';

<LoadingSpinner size="md" text="Loading..." />
<PageLoading />
```

---

### Custom Hooks (`src/hooks/`)

#### useAsync

```tsx
const { status, data, error, execute } = useAsync(
  () => fetchData(),
  true, // immediate execution
);
```

#### useFetch

```tsx
const { status, data, error } = useFetch("/api/products");
```

#### useForm

```tsx
const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: { email: "", password: "" },
  onSubmit: async (values) => {
    // Handle submission
  },
});
```

#### usePagination

```tsx
const { currentPage, totalPages, startIndex, endIndex, nextPage, prevPage } =
  usePagination({
    totalItems: 100,
    itemsPerPage: 10,
  });
```

#### useLocalStorage

```tsx
const [value, setValue, isLoaded] = useLocalStorage("key", initialValue);
```

#### useDebounce

```tsx
const debouncedValue = useDebounce(searchValue, 300);
```

---

### Error Handling (`src/lib/errors.ts`)

```tsx
import {
  AppError,
  ValidationError,
  NotFoundError,
  handleAsync,
} from "@/lib/errors";

// Custom error handling
throw new ValidationError("Invalid input", { field: "email" });
throw new NotFoundError("Product not found");

// Async operation with error handling
const result = await handleAsync(async () => {
  return await fetchData();
});

if (!result.success) {
  const { message, code } = result.error;
}
```

---

### Validation (`src/lib/validation.ts`)

```tsx
import {
  validateField,
  validateForm,
  validatePhoneNumber,
} from "@/lib/validation";

// Single field validation
const error = validateField("user@example.com", {
  required: true,
  email: true,
  minLength: [5, "Min 5 chars"],
});

// Form validation
const errors = validateForm(formData, {
  email: { required: true, email: true },
  password: { required: true, minLength: [8, "Min 8 chars"] },
});

// Phone validation (Morocco)
const isValid = validatePhoneNumber("+212600000000");
```

---

### Context Providers

#### CartContext

```tsx
const { cart, addToCart, removeFromCart, updateQuantity, cartTotal } =
  useCart();
```

#### WishlistContext

```tsx
const { wishlist, addToWishlist, removeFromWishlist, isWishlisted } =
  useWishlist();
```

#### ToastContext

```tsx
const { showToast } = useToast();
showToast("Success!", "success");
showToast("Error!", "error");
```

---

### Logger (`src/lib/logger.ts`)

```tsx
import { logger } from "@/lib/logger";

logger.debug("Debug message", { data });
logger.info("Info message");
logger.warn("Warning message");
logger.error("Error message", error);

// Export logs
const logs = logger.getLogs("error", 50);
const json = logger.exportLogs();
```

---

## Advanced Features

### Error Boundary

Wraps the entire app to catch and handle React errors gracefully:

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### TypeScript Types

Comprehensive type definitions for all data structures:

```tsx
type Product, CartItem, Order, User, Review, etc.
```

### Configuration

Centralized app configuration in `src/lib/config.ts`:

```tsx
import { APP_CONFIG, CATEGORIES, CITIES } from "@/lib/config";
```

---

## Performance Optimizations

1. **Code Splitting**: Dynamic imports for routes and components
2. **Image Optimization**: Next.js Image component with optimization
3. **Lazy Loading**: Components and data loaded on demand
4. **Debouncing**: Search and input handling
5. **Memoization**: React.memo for expensive components
6. **Asset Optimization**: Minified CSS and JavaScript

---

## Accessibility Features

- ✅ Semantic HTML
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Color contrast compliance
- ✅ Screen reader support
- ✅ Focus management

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Installation & Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

---

## API Integration

### Product Service

```tsx
import { fetchProducts, fetchProductById, createOrder } from '@/services/products';

// Fetch all products
const products = await fetchProducts('men');

// Fetch single product
const product = await fetchProductById('1');

// Create order
const order = await createOrder({
  customer_name: 'John Doe',
  customer_phone: '+212600000000',
  customer_city: 'Casablanca',
  items: [...],
});
```

---

## Code Quality

- **TypeScript**: 100% type-safe codebase
- **Error Handling**: Comprehensive error boundaries and logging
- **Validation**: Client-side form validation
- **Testing**: Ready for Jest and React Testing Library
- **Linting**: ESLint configured for code quality

---

## Best Practices

1. **Use Context API** for global state management
2. **Implement Error Boundaries** for error handling
3. **Validate User Input** before submission
4. **Optimize Images** using Next.js Image
5. **Use TypeScript** for type safety
6. **Write Semantic HTML** for accessibility
7. **Test User Interactions** thoroughly

---

## Contributing

Project follows professional coding standards:

- Consistent naming conventions
- Comprehensive comments and documentation
- Modular component structure
- Clean code principles

---

## License

© 2024 IlyWear. All rights reserved.

---

## Contact & Support

- **Email**: support@ilywear.com
- **WhatsApp**: +212600000000
- **Website**: https://ilywear.com

---

## Version History

**v1.0.0** - Initial Release

- Core e-commerce functionality
- User authentication
- Product management
- Shopping cart system
- Professional UI/UX
- Comprehensive error handling
