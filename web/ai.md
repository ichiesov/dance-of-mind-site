# AI Development Guide for Next.js 15+ Project

> Comprehensive guide for Claude Code and AI assistants working on this Next.js project

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Principles](#architecture-principles)
4. [Project Structure](#project-structure)
5. [Development Workflow with Claude Code](#development-workflow-with-claude-code)
6. [Code Standards & Best Practices](#code-standards--best-practices)
7. [Component Patterns](#component-patterns)
8. [State Management](#state-management)
9. [Data Fetching Strategies](#data-fetching-strategies)
10. [Performance Optimization](#performance-optimization)
11. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
12. [Testing Strategy](#testing-strategy)
13. [Common Tasks](#common-tasks)

---

## Project Overview

**Framework**: Next.js 15+ with App Router  
**Runtime**: React 19  
**Language**: TypeScript (strict mode)  
**Styling**: Tailwind CSS  
**Package Manager**: npm/pnpm/yarn

### Key Features
- Server Components by default
- Server Actions for mutations
- Streaming with Suspense
- Middleware for auth/logging
- Optimized image handling
- Route handlers for API endpoints

---

## Technology Stack

### Core Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.0.0"
}
```

### Recommended Libraries
- **State Management**: MobX (mobx-react-lite), React Context (simple cases)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS + shadcn/ui components
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint 9 + Prettier
- **API Calls**: Native fetch with proper error handling

---

## Architecture Principles

### 1. Separation of Concerns
- **Server Components**: Data fetching, business logic
- **Client Components**: Interactivity, user events
- **Server Actions**: Mutations, form submissions
- **API Routes**: External API integrations

### 2. Progressive Enhancement
- Start with server-rendered content
- Add client-side interactivity where needed
- Use `'use client'` directive judiciously

### 3. Type Safety First
- Define TypeScript interfaces for all data structures
- Use strict mode in `tsconfig.json`
- Avoid `any` type; use `unknown` if needed

### 4. Performance by Default
- Leverage automatic code splitting
- Use dynamic imports for heavy components
- Implement proper caching strategies

---

## Project Structure

```
project-root/
├── .claude/                    # Claude Code configuration
│   ├── commands/              # Reusable Claude commands
│   │   ├── add-feature.md
│   │   ├── debug-issue.md
│   │   └── refactor.md
│   └── init.sh               # Project initialization script
├── .mcp.json                  # MCP server configuration
├── app/                       # Next.js App Router
│   ├── (auth)/               # Auth route group
│   ├── (marketing)/          # Marketing pages group
│   ├── api/                  # API route handlers
│   │   └── [...route]/
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── error.tsx             # Error boundary
│   ├── loading.tsx           # Loading UI
│   └── not-found.tsx         # 404 page
├── components/                # React components
│   ├── ui/                   # Reusable UI components (shadcn)
│   ├── features/             # Feature-specific components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── settings/
│   ├── layouts/              # Layout components
│   └── shared/               # Shared components
├── lib/                       # Utility functions
│   ├── actions/              # Server Actions
│   ├── api/                  # API client functions
│   ├── constants/            # Constants and configs
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   ├── utils/                # Helper functions
│   └── validations/          # Zod schemas
├── public/                    # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
├── middleware.ts              # Edge middleware
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

### Directory Guidelines

**Do:**
- Keep components in `components/features/` organized by feature
- Place Server Actions in `lib/actions/` grouped by domain
- Store types in `lib/types/` with clear naming
- Use route groups `(name)` for logical organization

**Don't:**
- Mix UI components with feature logic
- Create deeply nested folder structures (max 3-4 levels)
- Put everything in `app/` directory
- Use generic names like `utils.ts` or `helpers.ts` without context

---

## Development Workflow with Claude Code

### Initial Setup

When starting work on this project, Claude Code should:

1. **Read the project context**:
   ```bash
   # Claude automatically reads AI.md on startup
   # Review package.json, tsconfig.json, next.config.js
   ```

2. **Run initialization script**:
   ```bash
   ./.claude/init.sh
   ```

3. **Verify project health**:
   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

### Feature Development Workflow

#### Step 1: Research & Planning (CRITICAL)
```markdown
**Always start with planning phase:**

1. Read relevant files:
   - "Read all files related to [feature area]"
   - Don't write code yet!

2. Understand the context:
   - Review existing patterns
   - Check similar implementations
   - Identify dependencies

3. Create a detailed plan:
   - "think hard" - Use extended thinking mode
   - Break down into steps
   - Identify potential issues
   - Document the approach

4. (Optional) Use subagents for complex tasks:
   - Delegate research to specialized subagents
   - Keep main context clean
```

#### Step 2: Implementation
```markdown
1. Implement the solution:
   - Follow the plan created in Step 1
   - Verify reasonableness as you implement
   - Write tests alongside code (TDD)

2. Test the implementation:
   - Run unit tests
   - Test in development server
   - Use browser automation for UI features

3. Commit and document:
   - Create meaningful commit messages
   - Update documentation if needed
   - Create PR with description
```

### Claude Code Commands

Store these in `.claude/commands/`:

**add-feature.md**:
```markdown
# Add New Feature

1. Read existing code in [feature area]
2. Think hard about the implementation approach
3. Create a detailed plan
4. Implement with tests
5. Verify end-to-end functionality
6. Update documentation
7. Commit with descriptive message
```

**debug-issue.md**:
```markdown
# Debug Issue

1. Reproduce the issue
2. Read relevant error logs
3. Identify root cause using subagents if needed
4. Think about potential solutions
5. Implement fix
6. Add test to prevent regression
7. Verify fix works end-to-end
```

### Using Subagents

```typescript
// Example subagent for database queries
// .claude/subagents/database-analyst.json
{
  "name": "database-analyst",
  "model": "sonnet",
  "systemPrompt": "You are a database expert. Analyze queries for performance and correctness.",
  "tools": ["bash", "read_file"]
}
```

### Test-Driven Development (TDD) Pattern

```markdown
**When adding new functionality:**

1. "Write tests for [feature] with expected input/output"
2. "We're doing TDD - don't write implementation yet"
3. "Run tests and confirm they fail"
4. "Now implement the feature to make tests pass"
5. "Run tests again and verify they pass"
6. "Refactor if needed while keeping tests green"
```

---

## Code Standards & Best Practices

### TypeScript Standards

✅ **DO:**
```typescript
// Define explicit interfaces
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// Use type guards
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj
  );
}

// Prefer unknown over any
async function fetchData(): Promise<unknown> {
  const response = await fetch('/api/data');
  return response.json();
}
```

❌ **DON'T:**
```typescript
// Don't use any
function processData(data: any) { }

// Don't skip type definitions
const user = {
  id: "123",
  email: "user@example.com"
}; // Missing type annotation

// Don't use type assertions unnecessarily
const value = data as string; // Prefer type guards
```

### Next.js App Router Best Practices

#### Server Components (Default)

✅ **DO:**
```typescript
// app/dashboard/page.tsx
import { db } from '@/lib/db';

// Server Component - no 'use client' needed
export default async function DashboardPage() {
  // Fetch data directly in component
  const users = await db.user.findMany();
  
  return (
    <div>
      <h1>Dashboard</h1>
      <UserList users={users} />
    </div>
  );
}
```

#### Client Components

✅ **DO:**
```typescript
// components/features/auth/login-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/actions/auth';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  async function handleSubmit(formData: FormData) {
    const result = await login(formData);
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/dashboard');
    }
  }
  
  return (
    <form action={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

❌ **DON'T:**
```typescript
// Don't make everything a Client Component
'use client'; // ❌ Not needed for static content

export default function AboutPage() {
  return <div>About Us</div>;
}

// Don't fetch data in Client Components when Server Components can do it
'use client';

export default function Page() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data').then(/* ... */); // ❌ Should be Server Component
  }, []);
}
```

#### Server Actions

✅ **DO:**
```typescript
// lib/actions/user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';

const updateUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
});

export async function updateUser(
  userId: string,
  formData: FormData
) {
  try {
    // Validate input
    const data = updateUserSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
    });
    
    // Perform mutation
    await db.user.update({
      where: { id: userId },
      data,
    });
    
    // Revalidate cache
    revalidatePath('/dashboard/settings');
    
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data' };
    }
    return { error: 'Failed to update user' };
  }
}
```

❌ **DON'T:**
```typescript
// Don't put UI logic in Server Actions
'use server';

export async function submitForm(formData: FormData) {
  // ❌ No UI logic in Server Actions
  toast.success('Form submitted!');
  
  // ❌ Don't directly manipulate DOM
  document.querySelector('.modal')?.classList.add('hidden');
}

// Don't skip validation
'use server';

export async function createUser(formData: FormData) {
  // ❌ No validation
  const email = formData.get('email');
  await db.user.create({ data: { email } });
}
```

### API Route Handlers

✅ **DO:**
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = querySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });
    
    const users = await fetchUsers(query);
    
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

❌ **DON'T:**
```typescript
// Don't create bloated route handlers
export async function POST(request: NextRequest) {
  // ❌ Too much business logic in route handler
  const data = await request.json();
  const validated = validateData(data);
  const processed = await processData(validated);
  const result = await saveToDatabase(processed);
  await sendEmail(result);
  await logActivity(result);
  return NextResponse.json(result);
}

// Prefer: Extract to service functions
// lib/services/user-service.ts
export async function createUser(data: UserInput) {
  // All business logic here
}
```

---

## Component Patterns

### Component Composition

✅ **DO:**
```typescript
// components/features/dashboard/user-card.tsx
interface UserCardProps {
  user: User;
  actions?: React.ReactNode;
}

export function UserCard({ user, actions }: UserCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-4">
        <UserAvatar user={user} />
        <div>
          <h3>{user.name}</h3>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
      </div>
      {actions && (
        <div className="mt-4 flex gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

// Usage
<UserCard 
  user={user}
  actions={
    <>
      <Button>Edit</Button>
      <Button variant="destructive">Delete</Button>
    </>
  }
/>
```

### Collocate State

✅ **DO:**
```typescript
// Keep state close to where it's used
function SearchableList() {
  return (
    <div>
      <Header />
      <Sidebar />
      <MainContent /> {/* State lives here */}
    </div>
  );
}

function MainContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  return (
    <div>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <Results items={results} />
    </div>
  );
}
```

❌ **DON'T:**
```typescript
// Don't lift state unnecessarily high
function App() {
  // ❌ State too high in tree
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div>
      <Header /> {/* Re-renders unnecessarily */}
      <Sidebar /> {/* Re-renders unnecessarily */}
      <MainContent searchTerm={searchTerm} />
    </div>
  );
}
```

### Avoid Prop Drilling

✅ **DO:**
```typescript
// Use Context API for deeply nested props
import { createContext, useContext } from 'react';

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Deep component can access theme directly
function Button() {
  const { theme } = useTheme();
  return <button className={theme === 'dark' ? 'dark' : 'light'} />;
}
```

### Component File Organization

✅ **DO:**
```typescript
// components/features/auth/login-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/actions/auth';
import type { LoginFormData } from '@/lib/types/auth';

export function LoginForm() {
  // Component logic
}

// Export types if needed by consumers
export type { LoginFormData };
```

❌ **DON'T:**
```typescript
// Don't create index.tsx files everywhere
// components/features/auth/index.tsx ❌
export { LoginForm } from './login-form';
export { SignupForm } from './signup-form';

// Prefer direct imports:
import { LoginForm } from '@/components/features/auth/login-form';
```

---

## State Management

### Local State Priority

```typescript
// 1. Start with useState for simple state
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// 2. Use useReducer for complex state logic
function TodoList() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD_TODO' })}>
        Add Todo
      </button>
    </div>
  );
}

// 3. Use Context for shared state (avoid prop drilling)
const CartContext = createContext<CartState>(null!);

// 4. Use MobX for global state (complex apps)
import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';

class StoreState {
  items: Item[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addItem(item: Item) {
    this.items.push(item);
  }

  get itemCount() {
    return this.items.length;
  }
}

const storeContext = createContext(new StoreState());
export const useStore = () => useContext(storeContext);
```

### State Management Decision Tree

```
Is state needed in multiple unrelated components?
├─ NO → useState in parent component
└─ YES → Is it simple data passed to children?
    ├─ YES → Context API
    └─ NO → Complex global state?
        ├─ YES → MobX (with mobx-react-lite)
        └─ NO → Consider Server State (React Query/SWR)
```

### MobX Patterns in This Project

#### 1. Global Store (Provider Pattern)

```typescript
// src/store/AppStore.jsx
import { createContext, useContext } from 'react';
import { useLocalObservable } from 'mobx-react-lite';

const AppStoreContext = createContext(null);

export const AppStoreProvider = ({ children }) => {
  const store = useLocalObservable(() => ({
    // Observable state
    user: null,

    // Computed values
    get isAuthenticated() {
      return !!this.user;
    },

    // Actions
    setUser(user) {
      this.user = user;
    },
  }));

  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = () => {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }
  return store;
};
```

#### 2. Page-Level Store (Component-Scoped)

```typescript
// src/app/quest-page/store/quest.store.tsx
import { useLocalObservable } from 'mobx-react-lite';

const createQuestStore = () => ({
  // State
  isCompleted: false,
  score: 0,

  // Computed
  get status() {
    return this.isCompleted ? 'completed' : 'in-progress';
  },

  // Actions
  incrementScore(points: number) {
    this.score += points;
  },

  complete() {
    this.isCompleted = true;
  },
});

export const useQuestStore = () => {
  return useLocalObservable(() => createQuestStore());
};
```

#### 3. Using MobX Store in Components

```typescript
'use client';

import { observer } from 'mobx-react-lite';
import { useQuestStore } from './store/quest.store';

// ✅ GOOD: Wrap component with observer for reactive updates
export const QuestPage = observer(() => {
  const store = useQuestStore();

  return (
    <div>
      <h1>Score: {store.score}</h1>
      <p>Status: {store.status}</p>
      <button onClick={() => store.incrementScore(10)}>
        Add Points
      </button>
      <button onClick={() => store.complete()}>
        Complete Quest
      </button>
    </div>
  );
});
```

#### 4. MobX Best Practices

✅ **DO:**
```typescript
// Use makeAutoObservable for class-based stores
import { makeAutoObservable } from 'mobx';

class TodoStore {
  todos = [];

  constructor() {
    makeAutoObservable(this);
  }

  addTodo(todo) {
    this.todos.push(todo);
  }
}

// Use useLocalObservable for functional stores
const store = useLocalObservable(() => ({
  count: 0,
  increment() {
    this.count++;
  }
}));

// Wrap components with observer
export const Counter = observer(() => {
  const store = useStore();
  return <div>{store.count}</div>;
});
```

❌ **DON'T:**
```typescript
// ❌ Don't forget observer wrapper
export const Counter = () => {
  const store = useStore();
  return <div>{store.count}</div>; // Won't react to changes!
};

// ❌ Don't destructure observable values
const { count } = store; // Loses reactivity
// Instead: use store.count directly

// ❌ Don't mutate observables outside actions in strict mode
store.count = 5; // Use store.setCount(5) instead
```

---

## Data Fetching Strategies

### Server Components (Preferred)

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  
  return (
    <div>
      <h1>Posts</h1>
      <PostList posts={posts} />
    </div>
  );
}
```

### Static Site Generation (SSG)

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  
  return <Article post={post} />;
}
```

### Incremental Static Regeneration (ISR)

```typescript
// app/products/[id]/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  
  return <ProductDetails product={product} />;
}
```

### Client-Side Fetching (When Necessary)

```typescript
'use client';

import { useEffect, useState } from 'react';

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [userId]);
  
  if (loading) return <LoadingSkeleton />;
  if (!user) return <NotFound />;
  
  return <UserInfo user={user} />;
}
```

---

## Performance Optimization

### Code Splitting & Lazy Loading

✅ **DO:**
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@/components/features/analytics/heavy-chart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false, // Disable SSR if not needed
  }
);

export function Dashboard() {
  return (
    <div>
      <Header />
      <HeavyChart data={data} />
    </div>
  );
}
```

### Image Optimization

✅ **DO:**
```typescript
import Image from 'next/image';

export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={400}
        height={300}
        priority={false} // Only true for above-the-fold images
        placeholder="blur"
        blurDataURL={product.blurDataUrl}
      />
    </div>
  );
}
```

❌ **DON'T:**
```typescript
// Don't use regular <img> tags
<img src="/image.jpg" alt="Product" /> // ❌

// Don't forget dimensions
<Image src="/image.jpg" alt="Product" /> // ❌ Missing width/height
```

### React Optimization

```typescript
// 1. Memoize expensive calculations
import { useMemo } from 'react';

function ExpensiveComponent({ items }: { items: Item[] }) {
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.price - b.price),
    [items]
  );
  
  return <List items={sortedItems} />;
}

// 2. Memoize callbacks
import { useCallback } from 'react';

function Parent() {
  const handleClick = useCallback((id: string) => {
    // Handle click
  }, []); // Only recreate if dependencies change
  
  return <Child onClick={handleClick} />;
}

// 3. Memoize components
import { memo } from 'react';

export const ExpensiveChild = memo(function ExpensiveChild({
  data
}: {
  data: Data
}) {
  // Only re-renders when data changes
  return <div>{/* Complex rendering */}</div>;
});
```

### Bundle Size Optimization

```typescript
// next.config.js
module.exports = {
  // Analyze bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Replace heavy libraries with lighter alternatives
        'moment': 'dayjs',
      };
    }
    return config;
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Configure external packages
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
    ],
  },
};
```

---

## Anti-Patterns to Avoid

### ❌ 1. Using Index as Key

**DON'T:**
```typescript
// ❌ BAD: Using array index as key
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user, index) => (
        <li key={index}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**DO:**
```typescript
// ✅ GOOD: Using unique identifier as key
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Why it's bad:** Causes React to lose track of component identity when list order changes, leading to incorrect re-renders and lost component state.

---

### ❌ 2. Mutating State Directly

**DON'T:**
```typescript
// ❌ BAD: Mutating state directly
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  
  function addTodo(todo: Todo) {
    todos.push(todo); // ❌ Direct mutation
    setTodos(todos);  // React won't detect change
  }
}
```

**DO:**
```typescript
// ✅ GOOD: Creating new state
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  
  function addTodo(todo: Todo) {
    setTodos([...todos, todo]); // ✅ New array
  }
  
  // Or use functional update
  function addTodoSafely(todo: Todo) {
    setTodos(prevTodos => [...prevTodos, todo]);
  }
}
```

**Why it's bad:** React uses shallow comparison to detect state changes. Direct mutations don't trigger re-renders.

---

### ❌ 3. Creating Components Inside Components

**DON'T:**
```typescript
// ❌ BAD: Component defined inside another component
function Parent() {
  const ChildComponent = () => {
    return <div>Child</div>;
  };
  
  return <ChildComponent />; // New component instance every render
}
```

**DO:**
```typescript
// ✅ GOOD: Component defined outside
function ChildComponent() {
  return <div>Child</div>;
}

function Parent() {
  return <ChildComponent />;
}
```

**Why it's bad:** Creates a new component type on every render, destroying and recreating the entire component tree, losing state and causing performance issues.

---

### ❌ 4. Excessive Prop Drilling

**DON'T:**
```typescript
// ❌ BAD: Passing props through many layers
function App() {
  const [theme, setTheme] = useState('light');
  
  return <Page theme={theme} />;
}

function Page({ theme }: { theme: string }) {
  return <Content theme={theme} />;
}

function Content({ theme }: { theme: string }) {
  return <Section theme={theme} />;
}

function Section({ theme }: { theme: string }) {
  return <Button theme={theme} />;
}
```

**DO:**
```typescript
// ✅ GOOD: Using Context
const ThemeContext = createContext<string>('light');

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

**Why it's bad:** Makes code hard to maintain, couples unrelated components, and creates unnecessary re-renders.

---

### ❌ 5. Missing Dependency Arrays in Hooks

**DON'T:**
```typescript
// ❌ BAD: Incomplete dependency array
function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    fetchResults(query).then(setResults);
  }, []); // ❌ Missing 'query' dependency
}
```

**DO:**
```typescript
// ✅ GOOD: Complete dependency array
function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    let cancelled = false;
    
    fetchResults(query).then(data => {
      if (!cancelled) {
        setResults(data);
      }
    });
    
    return () => {
      cancelled = true;
    };
  }, [query]); // ✅ All dependencies included
}
```

**Why it's bad:** Leads to stale closures, using outdated values, and subtle bugs that are hard to track down.

---

### ❌ 6. Using useState for Derived State

**DON'T:**
```typescript
// ❌ BAD: Storing derived state
function ProductList({ products }: { products: Product[] }) {
  const [products, setProducts] = useState(products);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortedProducts, setSortedProducts] = useState(products);
  
  useEffect(() => {
    const filtered = products.filter(/*...*/);
    setFilteredProducts(filtered);
    const sorted = filtered.sort(/*...*/);
    setSortedProducts(sorted);
  }, [products]);
}
```

**DO:**
```typescript
// ✅ GOOD: Calculating derived state
function ProductList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  const displayProducts = useMemo(() => {
    return products
      .filter(p => p.name.includes(filter))
      .sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1);
  }, [products, filter, sortBy]);
  
  return <List products={displayProducts} />;
}
```

**Why it's bad:** Creates unnecessary state, synchronization issues, and multiple sources of truth.

---

### ❌ 7. Overusing useEffect

**DON'T:**
```typescript
// ❌ BAD: Using useEffect for synchronous calculations
function CartTotal({ items }: { items: CartItem[] }) {
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const sum = items.reduce((acc, item) => acc + item.price, 0);
    setTotal(sum);
  }, [items]);
  
  return <div>Total: ${total}</div>;
}
```

**DO:**
```typescript
// ✅ GOOD: Calculating during render
function CartTotal({ items }: { items: CartItem[] }) {
  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.price, 0),
    [items]
  );
  
  return <div>Total: ${total}</div>;
}
```

**Why it's bad:** Adds unnecessary render cycles and complexity. useEffect is for side effects, not calculations.

---

### ❌ 8. Not Using React Fragments

**DON'T:**
```typescript
// ❌ BAD: Unnecessary wrapper divs
function Component() {
  return (
    <div>
      <h1>Title</h1>
      <p>Description</p>
    </div>
  );
}
```

**DO:**
```typescript
// ✅ GOOD: Using fragments
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Description</p>
    </>
  );
}

// Or with key prop
function List({ items }: { items: Item[] }) {
  return (
    <>
      {items.map(item => (
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </>
  );
}
```

**Why it's bad:** Creates unnecessary DOM nodes, complicates CSS styling, and impacts accessibility.

---

### ❌ 9. Mixing Client and Server Logic

**DON'T:**
```typescript
// ❌ BAD: Client component fetching data
'use client';

export default function Page() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []);
  
  return <div>{data}</div>;
}
```

**DO:**
```typescript
// ✅ GOOD: Server component fetching data
export default async function Page() {
  const data = await fetch('/api/data').then(res => res.json());
  
  return <div>{data}</div>;
}
```

**Why it's bad:** Misses benefits of server-side rendering, adds unnecessary client-side JavaScript, and creates loading states.

---

### ❌ 10. Not Implementing Error Boundaries

**DON'T:**
```typescript
// ❌ BAD: No error handling
export default function Page() {
  return <ComponentThatMightCrash />;
}
```

**DO:**
```typescript
// ✅ GOOD: Error boundary implementation
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/global-error.tsx - for root layout errors
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

**Why it's bad:** Unhandled errors crash the entire application, providing poor user experience.

---

### ❌ 11. Nesting Too Deep

**DON'T:**
```typescript
// ❌ BAD: Deep folder nesting
src/
  components/
    features/
      dashboard/
        widgets/
          weather/
            current/
              small/
                index.tsx
```

**DO:**
```typescript
// ✅ GOOD: Flatter structure
src/
  components/
    features/
      dashboard/
        weather-widget.tsx
        small-weather-widget.tsx
```

**Why it's bad:** Makes navigation difficult, imports verbose, and code harder to find.

---

### ❌ 12. Creating One Giant Utility File

**DON'T:**
```typescript
// ❌ BAD: lib/utils.ts (2000+ lines)
export function formatDate() { }
export function validateEmail() { }
export function calculateTotal() { }
export function parseJSON() { }
// ... 100 more functions
```

**DO:**
```typescript
// ✅ GOOD: Organized by domain
lib/
  utils/
    date.ts           // formatDate, parseDate, etc.
    validation.ts     // validateEmail, validatePhone, etc.
    calculations.ts   // calculateTotal, calculateTax, etc.
    parsers.ts        // parseJSON, parseCSV, etc.
```

**Why it's bad:** Makes code hard to maintain, difficult to find functions, and increases bundle size.

---

### ❌ 13. Ignoring Loading and Error States

**DON'T:**
```typescript
// ❌ BAD: No loading/error handling
'use client';

export function UserProfile() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch('/api/user').then(res => res.json()).then(setUser);
  }, []);
  
  return <div>{user.name}</div>; // ❌ Crashes if user is null
}
```

**DO:**
```typescript
// ✅ GOOD: Proper state handling
'use client';

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;
  
  return <div>{user.name}</div>;
}
```

**Why it's bad:** Creates poor user experience and runtime errors.

---

### ❌ 14. Using Uncontrolled Components Everywhere

**DON'T:**
```typescript
// ❌ BAD: Uncontrolled form
function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  function handleSubmit() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    // Hard to validate, no intermediate state
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} type="email" />
      <input ref={passwordRef} type="password" />
    </form>
  );
}
```

**DO:**
```typescript
// ✅ GOOD: Controlled form with validation
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  function validate() {
    const newErrors: Record<string, string> = {};
    if (!email.includes('@')) {
      newErrors.email = 'Invalid email';
    }
    if (password.length < 8) {
      newErrors.password = 'Password too short';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      // Submit form
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}
      <input 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)}
      />
      {errors.password && <span>{errors.password}</span>}
    </form>
  );
}
```

**Why it's bad:** Makes validation difficult, limits interactivity, and harder to manage form state.

---

### ❌ 15. Everything in Pages Directory (Next.js 13+)

**DON'T:**
```typescript
// ❌ BAD: All code in app directory
app/
  dashboard/
    page.tsx (1000+ lines of components, logic, and fetching)
```

**DO:**
```typescript
// ✅ GOOD: Separated concerns
app/
  dashboard/
    page.tsx (50 lines - layout and data fetching)

components/
  features/
    dashboard/
      dashboard-header.tsx
      stats-card.tsx
      recent-activity.tsx

lib/
  actions/
    dashboard.ts
  types/
    dashboard.ts
```

**Why it's bad:** Makes code difficult to test, reuse, and maintain.

---

## Testing Strategy

### Unit Testing

```typescript
// __tests__/lib/utils/format-date.test.ts
import { formatDate } from '@/lib/utils/date';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('January 15, 2024');
  });
  
  it('handles invalid dates', () => {
    expect(formatDate(null)).toBe('Invalid date');
  });
});
```

### Component Testing

```typescript
// __tests__/components/login-form.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '@/components/features/auth/login-form';

describe('LoginForm', () => {
  it('displays validation errors', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });
  
  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

### Integration Testing

```typescript
// __tests__/integration/auth-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@/app/layout';

describe('Authentication Flow', () => {
  it('allows user to login and access dashboard', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Navigate to login
    await user.click(screen.getByText(/login/i));
    
    // Fill form
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });
});
```

---

## Common Tasks

### Adding a New Feature

```markdown
**Claude Code Workflow:**

1. Read existing code:
   ```
   Read all files related to [feature area]
   Read the API routes in app/api
   Read components in components/features
   ```

2. Create a plan:
   ```
   Think hard about implementing [feature name]
   - Database schema changes needed
   - API endpoints required
   - UI components to create
   - State management approach
   - Testing strategy
   ```

3. Implement step-by-step:
   ```
   Step 1: Create database migrations
   Step 2: Add API route handlers with validation
   Step 3: Create Server Actions
   Step 4: Build UI components
   Step 5: Add client-side interactivity
   Step 6: Write tests
   Step 7: Update documentation
   ```

4. Verify:
   ```
   Run tests
   Start dev server
   Test feature end-to-end in browser
   Check for console errors
   Verify responsive design
   ```

5. Commit:
   ```
   Commit changes with descriptive message
   Create pull request
   ```
```

### Debugging an Issue

```markdown
**Claude Code Workflow:**

1. Reproduce the issue:
   ```
   Start the dev server
   Navigate to [affected page]
   Take screenshots of the error
   Read console logs
   ```

2. Investigate:
   ```
   Read error stack trace
   Identify the file and function causing the error
   Read surrounding code for context
   Use subagent to analyze if complex
   ```

3. Create fix:
   ```
   Think about potential solutions
   Implement the fix
   Add tests to prevent regression
   ```

4. Verify:
   ```
   Run tests
   Manually verify fix in browser
   Check for side effects
   ```

5. Document:
   ```
   Update comments if needed
   Add to CHANGELOG
   Commit with reference to issue number
   ```
```

### Refactoring Code

```markdown
**Claude Code Workflow:**

1. Analyze current code:
   ```
   Read the file(s) to be refactored
   Identify code smells and anti-patterns
   Think about better structure
   ```

2. Plan refactoring:
   ```
   Think hard about the refactoring approach
   - What patterns to apply
   - How to maintain backwards compatibility
   - Testing strategy
   ```

3. Implement safely:
   ```
   Step 1: Add tests for existing behavior
   Step 2: Refactor in small increments
   Step 3: Run tests after each change
   Step 4: Update related code
   ```

4. Verify:
   ```
   Run all tests
   Check bundle size impact
   Verify no regressions
   ```
```

---

## Environment Configuration

### Required Files

**.env.local**
```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# API Keys
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_test_..."

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
```

**next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  images: {
    domains: ['images.unsplash.com', 'cdn.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Enable type checking in build
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Enable ESLint in build
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests passing (`npm run test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured
- [ ] SEO metadata complete
- [ ] Performance tested (Lighthouse score > 90)
- [ ] Accessibility tested (WCAG AA compliance)
- [ ] Security headers configured
- [ ] CORS policies set
- [ ] Rate limiting implemented
- [ ] Monitoring and logging enabled

---

## Additional Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Best Practices
- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application)
- [React Anti-Patterns](https://reactantipatterns.com/)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)

### Claude Code
- [Claude Code Docs](https://code.claude.com/docs)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Building Agents with Claude](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)

---

## Version History

- **v1.0.0** (2024-12-24): Initial version
  - Project structure guidelines
  - Best practices for Next.js 15
  - Anti-patterns documentation
  - Claude Code integration

---

## Maintenance

This document should be updated when:
- Major framework versions change
- New patterns emerge in the codebase
- Team discovers new anti-patterns
- Claude Code introduces new features
- Dependencies are upgraded significantly

**Last Updated**: December 24, 2024  
**Next.js Version**: 15.x  
**React Version**: 19.x