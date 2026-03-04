---
name: vitest-testing
description: Write and run Vitest tests for Golden Tier Peptide. Auto-activates when creating test files, debugging test failures, or asked to add tests. Covers component testing, utility testing, and Supabase mock patterns.
argument-hint: "[file or component to test]"
---

# Vitest Testing — Golden Tier Peptide

## Stack
- **Vitest** — test runner (compatible with Vite config)
- **@testing-library/react** — component testing
- **@testing-library/user-event** — simulating user interactions
- Test files: `*.test.ts` or `*.test.tsx` co-located with source files or in `src/__tests__/`

## Running Tests
```bash
# Run all tests
npm run test

# Run specific file
npx vitest src/lib/formatPrice.test.ts

# Watch mode
npx vitest --watch

# Coverage
npx vitest --coverage
```

## Test File Structure
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
    expect(result).toBe(expected);
  });
});
```

## Testing Utilities (formatPrice, etc.)
```typescript
// src/lib/formatPrice.test.ts
import { describe, it, expect } from 'vitest';
import { formatTHB } from './formatPrice';

describe('formatTHB', () => {
  it('formats a whole number with 2 decimals', () => {
    expect(formatTHB(1000)).toBe('฿1,000.00 THB');
  });

  it('formats with thousands separator', () => {
    expect(formatTHB(12345.67)).toBe('฿12,345.67 THB');
  });

  it('handles zero', () => {
    expect(formatTHB(0)).toBe('฿0.00 THB');
  });

  it('handles non-finite numbers gracefully', () => {
    expect(formatTHB(NaN)).toBe('฿0.00 THB');
    expect(formatTHB(Infinity)).toBe('฿0.00 THB');
  });

  it('skips decimals when showDecimals is false', () => {
    expect(formatTHB(1000, false)).toBe('฿1,000 THB');
  });
});
```

## Mocking Supabase
```typescript
import { vi } from 'vitest';

// Mock the Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  },
}));
```

## Mocking Context Providers
```typescript
import { vi } from 'vitest';

// Mock useAuth
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    isAdmin: false,
    isPartner: true,
    isCustomer: false,
    discountRate: 50,
  }),
}));

// Mock useDatabase
vi.mock('@/context/DatabaseContext', () => ({
  useDatabase: () => ({
    products: mockProducts,
    orders: [],
    isLoading: false,
    refreshData: vi.fn(),
  }),
}));

// Mock useCart
vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    items: [],
    cartTotal: 0,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
  }),
}));
```

## Component Test with Providers
```typescript
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Wrap components that need router
function renderWithRouter(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  );
}

it('renders product name', () => {
  const mockProduct = {
    id: '1', sku: 'BPC-157-5MG', name: 'BPC-157',
    price: 455, category: 'HEALING', /* ... */
  };
  renderWithRouter(<ProductCard product={mockProduct} />);
  expect(screen.getByText('BPC-157')).toBeInTheDocument();
});
```

## Testing User Interactions
```typescript
import userEvent from '@testing-library/user-event';

it('increments quantity when + is clicked', async () => {
  const user = userEvent.setup();
  const onUpdate = vi.fn();
  render(<QuantityInput value={1} onChange={onUpdate} />);

  await user.click(screen.getByRole('button', { name: /plus|increment|\+/i }));
  expect(onUpdate).toHaveBeenCalledWith(2);
});
```

## What to Test — Priority Order
1. **Utility functions** (formatTHB, price calculations) — pure functions, easiest to test
2. **Cart logic** (CartContext) — critical business logic
3. **Auth guards** (ProtectedRoute) — ensure access control works
4. **Key UI components** (ProductCard, CartSidebar) — visual regressions
5. **Form validation** (checkout, admin forms)

## What NOT to Test
- Supabase queries directly (test via mocks)
- Framer Motion animations (mock or skip)
- Three.js/R3F canvas (skip in unit tests)
- CSS/styling details (use visual regression tools instead)
