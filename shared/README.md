# Starithm Shared Components

A shared component library for all Starithm microfrontends.

## 📁 Structure

```
shared/
├── components/
│   ├── ui/
│   │   └── loading.tsx          # Animated loading component
│   └── index.ts                 # Main export file
├── colors.js                    # Shared color definitions
├── package.json                 # Package configuration
└── README.md                    # This file
```

## 🚀 Usage

### Import in Microfrontends

```typescript
// Import from shared components
import { Loading, LoadingCompact } from '../../../shared/components';

// Or import specific component
import { Loading } from '../../../shared/components/ui/loading';
```

### Available Components

#### Loading
Animated loading component with sliding text messages.

```typescript
import { Loading } from '../../../shared/components';

// Full loading component
<Loading title="Loading Alerts" />

// Compact version
<LoadingCompact />
```

**Props:**
- `title?: string` - Loading title (default: "Loading...")
- `className?: string` - Additional CSS classes

## 🎨 Features

- **Consistent Design** - All components use Starithm brand colors
- **TypeScript Support** - Full type safety
- **Responsive** - Works on all screen sizes
- **Accessible** - Follows accessibility best practices
- **Fun & Engaging** - Astronomy-themed loading messages

## 🔧 Development

### Adding New Components

1. Create component in `shared/components/ui/`
2. Export from `shared/components/index.ts`
3. Update this README with usage examples

### Shared Dependencies

Components use these peer dependencies:
- `react` - React framework
- `react-dom` - React DOM
- `lucide-react` - Icons

## 📝 Notes

- Components are shared via relative imports
- No separate build process needed
- Each microfrontend includes shared components in its build
- Maintains consistency across all microfrontends
