# 09 — Frontend Implementation & Design System

This document describes the frontend architecture of ExpenseWise, covering responsive layouts, navigation paradigms, design tokens, UI components, data visualization, and state management.

---

## 1. Layout & Navigation Shell

The primary authenticated interface is wrapped by [`components/layout/DashboardLayoutClient.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/layout/DashboardLayoutClient.jsx), which provides an adaptive, mobile-first shell:

### 1.1 Desktop Experience (Width ≥ 768px)
- **Fixed Sidebar**: 256px (`w-64`) left sidebar with brand wordmark, quick-add button, route links, ThemeToggle widget, PWA install button, and user account status.
- **Main Content**: Scrollable container (`md:pl-64`, `max-w-5xl mx-auto`) with responsive padding.

### 1.2 Mobile Experience (Width < 768px)
- **Sticky Top Bar**: Displays brand icon, wordmark, quick ThemeToggle, PWA Install button, and user avatar.
- **Molded Bottom Tab Bar**: Fixed 64px tab bar with:
  - `Home` (`/dashboard`)
  - `Activity` (`/expenses`)
  - **Elevated 3D Plus Action Button**: Center-anchored prominent button with `-mt-6` offset that dispatches `open-add-expense-modal` or redirects to `/expenses?action=add`.
  - `Budgets` (`/budgets`)
  - `More` (Triggers bottom slide-up drawer for `Debts`, `Reports`, `Admin Portal`, Theme switcher, and Logout).

---

## 2. Design System & CSS Custom Properties

The styling system is implemented in [`app/globals.css`](file:///d:/Sunbeam/Project/Expense-tracker/app/globals.css) using **Tailwind CSS v4** combined with dynamic CSS custom properties.

### 2.1 Dual-Theme Color Palette

| Token | Light Theme (Neumorphic Warm) | Dark Theme (Linear/Vercel Deep Onyx) |
| :--- | :--- | :--- |
| `--bg-main` | `#EAE6DF` (Warm Linen Sand) | `#090A0F` (Pitch Void Black) |
| `--bg-surface` | `#EDE9E3` (Soft Clay Surface) | `#12151F` (Elevated Onyx Glass) |
| `--text-primary` | `#1E2025` (Deep Charcoal) | `#F0F2F8` (Crisp Titanium White) |
| `--text-secondary` | `#7D8494` (Muted Pencil Slate) | `#8B95A8` (Soft Silver) |
| `--accent-blue` | `#0047FF` (Vibrant Electric Cobalt) | `#3B82F6` (Electric Blue Glow) |
| `--color-profit` | `#10B981` (Emerald Green) | `#10B981` (Vibrant Emerald) |
| `--color-loss` | `#EF4444` (Crimson Red) | `#F87171` (Crimson Coral) |

### 2.2 Elevation & Neumorphic Shadow Tokens
```css
/* Light Mode Soft Shadows */
--neu-flat: 6px 6px 14px #D1CCC4, -6px -6px 14px #FFFFFF;
--neu-pressed: inset 4px 4px 8px #D1CCC4, inset -4px -4px 8px #FFFFFF;
--neu-card: 8px 8px 18px #D1CCC4, -8px -8px 18px #FFFFFF;

/* Dark Mode Linear Glass Shadows */
--neu-flat: 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
--neu-pressed: inset 2px 2px 6px rgba(0, 0, 0, 0.6);
--neu-card: 0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.09);
```

---

## 3. Reusable UI Components

### 3.1 `CategoryIcon.jsx` ([`components/ui/CategoryIcon.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/ui/CategoryIcon.jsx))
- Dynamically maps string identifiers stored in PostgreSQL (`Utensils`, `Car`, `ShoppingBag`, `Film`, `Receipt`, `Activity`, `GraduationCap`, `Layers`) to genuine Lucide React SVG components.

### 3.2 `ThemeToggle.jsx` ([`components/ui/ThemeToggle.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/ui/ThemeToggle.jsx))
- Multi-variant theme switch:
  - `sidebar`: Full-width pill segmented control with Sun & Moon icons.
  - `header`: Compact icon button for mobile top bar.
  - `compact`: Micro toggle button.

### 3.3 `InstallPwaButton.jsx` ([`components/ui/InstallPwaButton.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/ui/InstallPwaButton.jsx))
- Detects standalone display mode (`window.matchMedia('(display-mode: standalone)')`).
- Listens for `beforeinstallprompt` event on Chrome/Edge/Android.
- Detects Safari on iOS and displays a step-by-step modal guide ("Tap Share -> Add to Home Screen").

### 3.4 `skeletons.jsx` ([`components/ui/skeletons.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/ui/skeletons.jsx))
- Neumorphic shimmer loading skeletons matching exact layouts of Dashboard, Expense Table, Budgets, and Admin tabs.

---

## 4. Visualizations & Charting (`recharts`)

- **Dashboard Spending Trajectory**: [`components/dashboard/SpendingTrendChart.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/dashboard/SpendingTrendChart.jsx) renders a responsive `AreaChart` with smooth monotone curve, dual-stop linear gradients, custom tooltip formatters, and dark-mode adaptive grid lines.
- **Admin Macro Analytics**: [`components/admin/AdminAnalyticsCharts.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/admin/AdminAnalyticsCharts.jsx) renders multiple charts (Gross Volume Trend, Category Donut, Payment Method Bar Chart, User Engagement Tiers). It is dynamically imported with `ssr: false` to keep initial bundle sizes minimal.

---

## 5. State Management & Interaction Patterns

1. **Theme State**: Handled via React Context in [`components/theme/ThemeProvider.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/theme/ThemeProvider.jsx), persisted to `localStorage` key `'expensewise-theme'`.
2. **Page Data Hydration**: Pages invoke Server Actions inside `useEffect` on initial mount, manage local component states for active tabs and search filters, and use optimistic state updates where appropriate.
3. **Cross-Component Events**: Global quick-add button dispatches a window event (`open-add-expense-modal`) when already on `/expenses` to open the modal without page reload.
