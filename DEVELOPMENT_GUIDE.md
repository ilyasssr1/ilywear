# Development Guidelines & Best Practices

## Code Style Guidelines

### TypeScript

- Always use TypeScript for type safety
- Import types explicitly: `import type { ComponentProps } from 'react'`
- Avoid `any` type, use `unknown` or specific types
- Export interfaces and types from dedicated files
- Use `interface` for component props, `type` for primitives

```tsx
// ✅ Good
import type { FC } from "react";
interface ButtonProps {
  variant: "primary" | "secondary";
  onClick: () => void;
}

const Button: FC<ButtonProps> = ({ variant, onClick }) => {
  // ...
};

// ❌ Avoid
const Button = (props: any) => {
  // ...
};
```

### Components

- Use functional components with hooks
- Keep components small and focused
- Extract logic to custom hooks
- Use React.memo for expensive components
- Always provide default props or make them optional

```tsx
// ✅ Good
interface CardProps {
  title: string;
  description?: string; // Optional
  isLoading?: boolean;
}

const Card: FC<CardProps> = ({ title, description, isLoading = false }) => {
  return <div>{/* ... */}</div>;
};

export default Card;

// ❌ Avoid
const Card = ({ title, description, isLoading }) => {
  // Missing TypeScript and no defaults
};
```

### Naming Conventions

- **Components**: PascalCase (`UserCard.tsx`)
- **Files**: PascalCase for components, lowercase for utilities (`utils.ts`)
- **Functions**: camelCase (`calculateTotal()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Boolean variables**: Start with `is`, `has`, `should` (`isLoading`, `hasError`)
- **Event handlers**: `handle` prefix (`handleClick`, `handleSubmit`)
- **Getters**: `get` prefix (`getProductById`)
- **Async functions**: Use `async/await`, not promises unless necessary

### Error Handling

```tsx
// ✅ Good - Try/catch with proper error handling
try {
  const result = await fetchData();
  setData(result);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  showToast(message, "error");
}

// ❌ Avoid - Ignoring errors
const result = await fetchData();
```

### Comments & Documentation

```tsx
/**
 * Calculate the total price of items in cart
 * @param items - Array of cart items
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @returns Total price including tax
 */
export function calculateTotal(items: CartItem[], taxRate: number): number {
  // Implementation
}
```

---

## Performance Best Practices

### 1. Image Optimization

```tsx
// ✅ Good - Using Next.js Image
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.title}
  width={300}
  height={300}
  priority={false}
  className="object-cover"
/>

// ❌ Avoid - Using regular img tag
<img src={product.image} alt={product.title} />
```

### 2. Memoization

```tsx
// ✅ Good - Memoize expensive components
import { memo } from "react";

const ExpensiveComponent = memo(({ data }: Props) => {
  return <div>{/* ... */}</div>;
});

// ✅ Good - Memoize callbacks
const handleClick = useCallback(() => {
  // Implementation
}, [dependency]);
```

### 3. Code Splitting

```tsx
// ✅ Good - Dynamic import for large components
const HeavyComponent = dynamic(() => import("@/components/Heavy"), {
  loading: () => <LoadingSpinner />,
});

// Only loads when needed!
```

### 4. API Calls

```tsx
// ✅ Good - Debounced search
const debouncedSearch = useDebounce(query, 300);

useEffect(() => {
  if (debouncedSearch) {
    searchProducts(debouncedSearch);
  }
}, [debouncedSearch]);

// ✅ Good - Proper caching
const { data, error } = useFetch(query ? `/api/search?q=${query}` : null);
```

---

## API Integration

### Fetching Data

```tsx
// ✅ Good - Using custom hooks
const { status, data, error } = useFetch("/api/products");

if (status === "loading") return <LoadingSpinner />;
if (status === "error")
  return <Alert severity="error" message="Failed to load" />;
return <ProductList products={data} />;

// ✅ Alternative - Using async operation
const { status, data, error, execute } = useAsync(() => fetchProducts());
```

### Error Handling

```tsx
// ✅ Good - Proper error handling
import { handleAsync, AppError } from "@/lib/errors";

const result = await handleAsync(async () => {
  return await fetchData();
});

if (!result.success) {
  showToast(result.error.message, "error");
}
```

---

## State Management

### Context API Best Practices

```tsx
// ✅ Good - Separated context and provider
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

// ✅ Good - Using callbacks for performance
const addToCart = useCallback((item) => {
  // Implementation
}, []);
```

---

## Accessibility

### Semantic HTML

```tsx
// ✅ Good - Proper semantic elements
<header>Navigation</header>
<main>
  <article>Content</article>
  <aside>Sidebar</aside>
</main>
<footer>Footer</footer>

// ❌ Avoid - Using divs for everything
<div>Navigation</div>
<div>
  <div>Content</div>
  <div>Sidebar</div>
</div>
```

### ARIA Labels

```tsx
// ✅ Good - Descriptive ARIA labels
<button aria-label="Close menu" onClick={handleClose}>
  <X />
</button>

<form role="search" aria-label="Search products">
  <input aria-label="Search query" />
</form>

// ✅ Good - Live regions for dynamic content
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

---

## Testing Guidelines

### Component Testing

```tsx
// ✅ Good - Testing with user interaction
import { render, screen, fireEvent } from "@testing-library/react";

test("should add item to cart", () => {
  render(<CartButton />);
  const button = screen.getByRole("button", { name: /add to cart/i });
  fireEvent.click(button);
  // Assert results
});
```

---

## Git Commit Messages

```
feat: add new shopping cart feature
fix: resolve cart calculation bug
docs: update API documentation
style: format code according to eslint
refactor: reorganize component structure
test: add unit tests for utils
perf: optimize image loading
```

---

## Environment Setup

### Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in required environment variables
3. Never commit `.env.local`
4. Use `.env.local` for local overrides only

### Code Quality Tools

```bash
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
npm run type-check        # Check TypeScript
```

---

## Common Patterns

### Loading State with Error Handling

```tsx
const MyComponent: FC = () => {
  const { status, data, error } = useFetch("/api/data");

  switch (status) {
    case "loading":
      return <LoadingSpinner />;
    case "error":
      return <Alert variant="error" message={error?.message} />;
    case "success":
      return <div>{/* Render data */}</div>;
    default:
      return null;
  }
};
```

### Form with Validation

```tsx
const MyForm: FC = () => {
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: { email: "" },
    onSubmit: async (values) => {
      try {
        // Submit
      } catch (err) {
        // Handle error
      }
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="email"
        value={values.email}
        error={errors.email}
        onChange={handleChange}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

---

## Performance Checklist

- [ ] Images are optimized (use Next.js Image)
- [ ] Components are memoized if expensive
- [ ] API calls are debounced/throttled
- [ ] Unused dependencies removed
- [ ] Bundle size is acceptable
- [ ] No memory leaks (proper cleanup)
- [ ] Lighthouse score > 90
- [ ] Mobile performance is good

---

## Security Checklist

- [ ] Never expose API keys in client code
- [ ] Validate all user input
- [ ] Use HTTPS in production
- [ ] Implement CORS properly
- [ ] Sanitize HTML content
- [ ] Use secure authentication
- [ ] Keep dependencies updated
- [ ] No hardcoded secrets in code

---

## Debugging Tips

### Browser DevTools

- Use React DevTools for component inspection
- Use Network tab to debug API calls
- Use Console tab for error messages
- Use Performance tab for bottlenecks

### Logging

```tsx
import { logger } from "@/lib/logger";

logger.debug("Debug info", { data });
logger.error("Something wrong", error);
```

### React DevTools

- Inspect component props
- Track component renders
- Track context changes
- Profile performance

---

For more details, see: [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)
