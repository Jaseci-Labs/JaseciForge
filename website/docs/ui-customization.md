# UI Customization Guide

After bootstrapping your module, it's time to customize its UI. Jaseci Forge uses a structured design system based on Atomic Design principles, built on top of Tailwind CSS and shadcn/ui components.

## Design System Hierarchy

### 1. Atoms (Base Components)
The foundation of our UI system, built using [shadcn/ui](https://ui.shadcn.com/) components. These are the smallest, most basic building blocks:

- Buttons
- Inputs
- Cards
- Typography
- Icons

Learn more about atoms in our [Design System Concepts](./concepts/atoms) guide.

### 2. Molecules
Combinations of atoms that form functional units. Molecules are the building blocks for organisms:

- Form Fields (Input + Label + Error Message)
- Search Bars (Input + Button + Icon)
- Navigation Items (Link + Icon + Text)
- Data Table Headers (Text + Sort Icon + Filter)
- Card Headers (Title + Action Buttons)

See examples in our [Molecules Guide](./concepts/molecules).

### 3. Organisms
Complex UI components that combine molecules and atoms. Organisms are self-contained, reusable components that represent a distinct section of an interface:

- Data Tables (Table Header + Row + Pagination)
- Navigation Bars (Logo + Menu Items + User Menu)
- Form Sections (Form Fields + Submit Button)
- Card Lists (Card + Action Buttons)
- Filter Panels (Search + Filters + Sort Options)

Explore organisms in our [Organisms Guide](./concepts/organisms).

### 4. Templates
Page layouts that define the structure and composition. Templates are the skeleton of pages and determine where organisms are placed:

- Dashboard Template (Sidebar + Header + Main Content)
- Form Template (Header + Form Section + Action Bar)
- List Template (Header + Filter Panel + List + Pagination)
- Detail Template (Header + Content Sections + Action Bar)

Learn about templates in our [Templates Guide](./concepts/templates).

## Customizing Your Module

### 1. Page Structure

Each page consists of hooks for data management and a template for layout:

```typescript
// modules/products/pages/ProductList.tsx
import { useProducts } from '../hooks/useProducts';
import { DashboardTemplate } from '@/ds/templates/DashboardTemplate';
import { ProductListOrganism } from '@/ds/organisms/ProductList';

export function ProductList() {
  const { products, isLoading, error } = useProducts();
  const handleAddProduct = () => {
    // Module-specific logic
  };

  return (
    <DashboardTemplate>
      <ProductListOrganism
        products={products}
        isLoading={isLoading}
        error={error}
        onAddProduct={handleAddProduct}
      />
    </DashboardTemplate>
  );
}
```

### 2. Template and Organism Integration

Templates provide the page structure and contain organisms:

```typescript
// ds/templates/DashboardTemplate.tsx
interface DashboardTemplateProps {
  children: React.ReactNode;
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        {/* Navigation content */}
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

### 3. Organism and Molecule Composition

Organisms are composed of molecules and atoms:

```typescript
// ds/organisms/ProductList.tsx
import { TableHeader } from '@/ds/molecules/TableHeader';
import { ProductRow } from '@/ds/molecules/ProductRow';
import { Pagination } from '@/ds/molecules/Pagination';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onAddProduct: () => void;
}

export function ProductList({ products, isLoading, error, onAddProduct }: ProductListProps) {
  return (
    <Card>
      <TableHeader
        title="Products"
        onAdd={onAddProduct}
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <ProductRow key={product.id} product={product} />
          ))}
          <Pagination
            currentPage={1}
            totalPages={10}
            onPageChange={() => {}}
          />
        </div>
      )}
    </Card>
  );
}
```

## Best Practices

1. **Page Organization**
   - Pages contain hooks for data management
   - Pages use templates for layout
   - Templates contain organisms for content

2. **Component Composition**
   - Templates define page structure
   - Organisms combine molecules and atoms
   - Molecules combine atoms for specific functions
   - Atoms are the basic building blocks

3. **Responsive Design**
   - Use Tailwind's responsive classes
   - Test on different screen sizes


4. **Accessibility**
   - Use semantic HTML
   - Include proper ARIA attributes


## Next Steps

1. Explore our [Design System Concepts](./concepts/atoms) for detailed component documentation
2. Check out our [Templates Guide](./concepts/templates) for available layouts
3. Review shadcn ui [Component Library](https://ui.shadcn.com/docs/components/accordion) for ready-to-use components
4. Learn about [Theme Customization](./concepts/theming) for brand-specific styling
