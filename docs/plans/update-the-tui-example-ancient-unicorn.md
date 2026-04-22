# Plan: Full Interactive TUI Example

## Context

The package currently has three minimal examples (minimal.tsx, themed.tsx, keybindings.tsx). None demonstrate more than 2-3 components. Goal: add `examples/interactive.tsx` — a multi-tab showcase that exercises most of the exported UI surface, with a run script wired into package.json.

---

## Files to Modify

| File | Change |
|------|--------|
| `examples/interactive.tsx` | Create — new full showcase |
| `package.json` | Add `"example:interactive": "bun run examples/interactive.tsx"` |

---

## Implementation Plan

### 1. `examples/interactive.tsx`

**App structure:**
```
┌── TUI Component Showcase ─────────────────────────────────┐
│  [1: Widgets] [2: Input] [3: Markdown] [4: Theme]          │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  (tab content)                                              │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  1-4 / ←→ / Tab: switch   T: toggle theme   Q/Ctrl+C: exit │
└────────────────────────────────────────────────────────────┘
```

**Root `App` component:**
- `useState` for `activeTab: 'widgets' | 'input' | 'markdown' | 'theme'` and `theme: 'dark' | 'light'`
- `useInput` handles: `1-4` (direct tab jump), `Tab`/`←`/`→` (cycle tabs), `T` (toggle theme), `Q`/`Ctrl+C` (exit)
- `useTerminalViewport` → pass `columns` as `width` to outer Box
- Wrap inner content in `<ThemeProvider initialState={theme}>` (overrides the one from `render()`)

**Tab bar (custom, no `Tabs` component):**  
Use `useInput` nav instead of design-system `Tabs` (which requires `KeybindingProvider`). Render tab labels as `Box` rows with `color` + `bold` when active, `dimColor` when inactive.

**Tab 1 — Widgets:**
- `<Spinner label="Loading data..." />`
- `<ProgressBar ratio={progress} width={40} fillColor="success" />` — animated via `useInterval` (100 ms tick, `progress` cycles 0→1)
- `<LoadingState message="Fetching resources" />`
- `<LoadingState message="Building artifacts" bold subtitle="Step 2 of 5" />`
- `<Divider title="..." />` sections

**Tab 2 — Input:**
- `<TextInput value={...} onChange={...} onSubmit={...} focus={true} />` inside a bordered Box
- Shows submitted value below
- `<CustomSelect options={[{label, value}, ...]} onChange={...} />` with 5 language options

**Tab 3 — Markdown:**
- `<Suspense fallback={<LoadingState message="Rendering..." />}>` wrapping `<Markdown>{sampleMarkdown}</Markdown>`
- Sample markdown includes headings, bold/italic, inline code, code block (typescript), blockquote, table

**Tab 4 — Theme:**
- Shows current theme name
- `<OrderedList>` / `<OrderedListItem>` (4 items explaining the theme system)
- `<Byline>` with `<KeyboardShortcutHint>` entries for all shortcuts

**Imports from `'../src/index.js'`** (source, not dist):
```ts
import React, { useState, Suspense } from 'react'
import {
  render, Box, Text, ThemeProvider,
  useInput, useInterval, useTerminalViewport,
  Spinner, ProgressBar, LoadingState, Divider, Markdown,
  TextInput, CustomSelect, OrderedList, OrderedListItem,
  Byline, KeyboardShortcutHint,
} from '../src/index.js'
```

### 2. `package.json` script addition

```json
"example:interactive": "bun run examples/interactive.tsx"
```

---

## How to Run Locally

```bash
# From repo root or packages/tui:
cd /path/to/claude-code/packages/tui

# Install deps (only needed once):
bun install

# Run the interactive example:
bun run example:interactive
# or directly:
bun run examples/interactive.tsx
```

**Requirements:** Bun ≥ 1.3 (the package uses Bun FFI for native Yoga layout — Node.js won't work).

**Keyboard controls inside the TUI:**
| Key | Action |
|-----|--------|
| `1` / `2` / `3` / `4` | Jump to that tab |
| `Tab` / `→` | Next tab |
| `←` | Previous tab |
| `T` | Toggle dark/light theme |
| `Q` or `Ctrl+C` | Exit |

---

## Verification

1. `bun run example:interactive` — TUI renders without errors
2. Press `1-4` — each tab renders its content
3. Tab/←/→ — cycles correctly through tabs
4. Widgets tab — spinner animates, progress bar fills continuously
5. Input tab — type text, press Enter → submitted value appears; arrow keys work in CustomSelect
6. Markdown tab — formatted markdown renders (code block, table, blockquote)
7. Theme tab — `T` toggles dark↔light, ordered list renders numbered items
8. `Q` or `Ctrl+C` — exits cleanly
