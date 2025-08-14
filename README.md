# Starithm Frontend - Consolidated Microfrontend Application

This is the consolidated frontend repository for Starithm, containing both the home microfrontend and NovaTrace microfrontend in a single repository.

## Architecture Overview

```
Starithm Home/                    # Main Frontend Repository
├── 📁 microfrontends/
│   ├── 📁 home/                  # Home Microfrontend (port 5173)
│   │   ├── components/
│   │   │   ├── Homepage.tsx      # Landing page
│   │   │   └── ui/
│   │   ├── styles/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── 📁 novatrace/             # NovaTrace Microfrontend (port 5175)
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
├── 📁 src/                       # Shell Application (port 3000)
│   ├── microfrontends/
│   │   ├── HomeMicrofrontend.tsx
│   │   └── NovaTraceMicrofrontend.tsx
│   ├── App.tsx                   # Main shell app
│   └── main.tsx                  # Entry point
├── 📁 public/                    # Shared assets
├── package.json                  # Shell dependencies
├── vite.config.ts               # Shell configuration
└── README.md                    # This file
```

## Getting Started

### 1. Install All Dependencies

```bash
# Install shell and all microfrontend dependencies
npm run install:all
```

### 2. Start All Services

```bash
# Start shell and both microfrontends
npm run dev:all
```

This will start:
- **Shell application** on http://localhost:3000 (main entry point)
- **Home microfrontend** on http://localhost:5173 (direct access)
- **NovaTrace microfrontend** on http://localhost:5174 (direct access)

### 3. Individual Development

```bash
# Shell only
npm run dev

# Home microfrontend only
cd microfrontends/home && npm run dev

# NovaTrace microfrontend only
cd microfrontends/novatrace && npm run dev
```

## Navigation

- **Home** (`/`): Landing page with features and call-to-action
- **NovaTrace** (`/novatrace`): Live alerts and astronomical data
- **Global Nav**: Switch between microfrontends seamlessly

## Development Workflow

### Adding New Features

1. **Home Features**: Work in `microfrontends/home/`
2. **NovaTrace Features**: Work in `microfrontends/novatrace/`
3. **Shared Components**: Consider creating a shared component library
4. **Shell Features**: Work in `src/` for navigation and orchestration

### Building for Production

```bash
# Build shell application
npm run build

# Build individual microfrontends
cd microfrontends/home && npm run build
cd microfrontends/novatrace && npm run build
```

## Benefits of This Structure

1. **Single Repository**: All frontend code in one place
2. **Independent Development**: Each microfrontend can be developed separately
3. **Shared Assets**: Common logos and assets in one location
4. **Easy Deployment**: Single repository to deploy
5. **Clear Separation**: Home and NovaTrace are clearly separated

## Future Improvements

1. **Module Federation**: Replace iframes with proper module federation
2. **Shared State**: Implement global state management
3. **Shared Components**: Create a shared component library
4. **Build Optimization**: Optimize bundle sizes and loading
5. **Authentication**: Add global authentication layer

## Backend Integration

The NovaTrace backend repository is now a pure backend repository without frontend code, making it cleaner and more focused on API development.
