# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dance of Mind** is an interactive web application built with Next.js 15, featuring multiple quest-based pages with animations, particles, and audio. The project is a monorepo containing:
- `web/` - Next.js frontend application (TypeScript/React)
- `server/` - Backend/deployment configuration

## Common Commands

### Development

```bash
# Navigate to web directory first
cd web

# Start development server (uses Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Code Quality

```bash
# The project uses Next.js ESLint configuration
cd web
npx eslint src/

# Format code (Prettier config exists)
npx prettier --write .
```

### Deployment

The project uses Docker for deployment with automatic CI/CD via GitHub Actions:

```bash
# Build Docker image (from web directory)
docker build -t dance-of-mind-web .

# The Dockerfile uses pnpm and multi-stage builds
# CI/CD pushes to private registry and triggers webhook deployment
```

## Architecture

### Monorepo Structure

```
/
├── web/                    # Main Next.js application
│   ├── src/
│   │   ├── app/           # Next.js 15 App Router pages
│   │   ├── components/    # Shared UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── models/        # TypeScript type definitions
│   │   ├── store/         # MobX state management
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets (images, audio)
│   └── Dockerfile         # Production deployment
└── server/                # Backend/deployment files
```

### State Management Philosophy

The project uses **MobX** with React for state management:

1. **Global Store**: `src/store/AppStore.jsx` and `AppStoreProvider.jsx`
   - Uses `mobx-react-lite` with `useLocalObservable`
   - Provider pattern wraps the entire app
   - Currently minimal (example implementation)

2. **Page-level Stores**: Each quest page has its own isolated store
   - Located in `src/app/{page-name}/store/`
   - Uses `useLocalObservable()` hook for component-scoped state
   - Examples: `cards.store.tsx`, `floating-words.store.tsx`, `quest.store.tsx`
   - Stores manage game logic, quest state, and UI interactions

3. **Pattern**: Create stores using factory functions that return observable objects
   ```typescript
   const createLocalStore = () => ({
     property: value,
     computed() { ... },
     action() { ... }
   });

   export const useMyStore = () => useLocalObservable(() => createLocalStore());
   ```

### Page Organization

Each quest page follows a consistent structure:

```
src/app/{page-name}/
├── page.tsx              # Page component
├── components/           # Page-specific components
│   └── index.ts         # Component exports
├── config/              # Configuration (animations, particles, etc.)
│   └── index.ts         # Config exports
└── store/               # MobX stores for page state
    └── index.ts         # Store exports
```

**Current Pages**:
- `cards` - Card matching quest with letter collection
- `comedy-tragedy` - Audio-visual quest with mask images
- `who-are-you` - Floating words interactive experience

### Path Aliases

The project uses TypeScript path aliases (defined in `tsconfig.json`):

```typescript
// Page-specific aliases (use these for imports within each page)
import { Component } from '@cards/components';
import { config } from '@comedy-tragedy/config';
import { store } from '@who-are-you/store';

// Shared modules
import { useHook } from '@hooks';
import { Model } from '@models';
import { util } from '@utils';
import { useAppStore } from '@store/AppStoreProvider';

// Assets
import img from 'images/wall.webp';
import audio from 'audio/background.mp3';

// General fallback
import { Component } from '@/components/ui/comet-card';
```

**Important**: When working within a specific page directory, prefer page-specific aliases (`@cards/*`, `@comedy-tragedy/*`, `@who-are-you/*`) over generic `@/*` for clarity.

### Animation & Interactivity

- **Motion**: Uses `motion` (Framer Motion) for animations
  - Note: React 19 compatibility handled via package overrides
  - Common patterns: `motion.div`, `useAnimationControls`, `whileTap`, `whileHover`

- **Particles**: `@tsparticles/slim` for particle effects
  - Configuration in `{page}/config/particles.config.ts`

- **Audio**: `react-use-audio-player` with `AudioPlayerProvider`
  - Background audio loaded in root layout
  - Page-specific audio in individual components

### Styling Approach

1. **Tailwind CSS v4** with PostCSS
2. **CSS Modules** for component-specific styles (e.g., `letter.module.css`, `tragedy-img.module.css`)
3. **SCSS** for complex animations (e.g., `card-animated-border.scss`)
4. **Utility-first**: Use `cn()` from `@utils` for conditional classes (Tailwind Merge)

### Key Technical Decisions

- **Client Components**: All interactive pages use `'use client'` directive
- **Image Optimization**: Disabled (`unoptimized: true`) for static export compatibility
- **Base Path**: Configurable via `PAGES_BASE_PATH` environment variable for GitHub Pages deployment
- **Font**: Custom local font (mint.otf) with Geist Mono fallback
- **TypeScript**: Strict mode enabled, all new code must be typed

## Development Guidelines

### Adding a New Quest Page

1. Create page directory: `src/app/new-quest/`
2. Add page alias to `tsconfig.json` paths:
   ```json
   "@new-quest/*": ["src/app/new-quest/*"]
   ```
3. Follow the standard structure:
   - `page.tsx` - Main component
   - `components/` - UI components with index.ts
   - `config/` - Configuration with index.ts
   - `store/` - MobX stores with index.ts (if needed)
4. Update `EPage` enum in `src/models/page.ts`

### Working with State

- Use MobX stores for complex state and game logic
- Keep stores close to where they're used (page-level stores)
- For global state, extend `AppStore.jsx` (currently minimal)
- Avoid prop drilling - use stores or context

### Component Patterns

- Extract reusable UI to `src/components/ui/`
- Page-specific components stay in `src/app/{page}/components/`
- Always create `index.ts` for clean imports
- Use TypeScript interfaces for props

### File Naming

- Components: PascalCase (e.g., `Card.tsx`, `FloatingWord.tsx`)
- Stores: kebab-case with `.store.tsx` suffix (e.g., `cards.store.tsx`)
- Config: kebab-case with `.config.ts` suffix (e.g., `animation.config.ts`)
- Utils: kebab-case (e.g., `array.utils.ts`)
- Models: kebab-case (e.g., `quest-state.ts`)

### Assets

- Images: Place in `public/images/`, import via `images/*` alias
- Audio: Place in `public/audio/`, import via `audio/*` alias
- Use Next.js `<Image>` component with appropriate `sizes` prop
- Set `priority={false}` for below-fold images

## CI/CD

The project auto-deploys on push to `master` branch:

1. **Build**: Docker multi-stage build using pnpm
2. **Push**: Image pushed to private Docker registry
3. **Deploy**: Webhook triggered for automatic deployment

Deployment configuration is in `.github/workflows/` (Docker build and webhook).

## Node Version

- Required: Node.js >= 20.0.0 (specified in package.json engines)
- Use `.nvmrc` file: `nvm use` when entering the project
