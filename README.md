# @vancityayush/tui

Rich React + Yoga terminal UI engine for building interactive terminal applications.

Superset of the upstream `ink` package: synchronized output, alt-screen, hyperlink pooling, focus manager, selection/copy, terminal-focus events, tab-status, bidi support, FPS tracking, theming, keybinding engine, and vim-mode input.

## Status

v0.1 — lifted from the source tree and trimmed into a publishable package shape. Bun-only for now because the package scripts, examples, and build are Bun-based.

## Install

```sh
bun add @vancityayush/tui react
```

## Quick start

```tsx
import { render, Box, Text } from '@vancityayush/tui'

await render(
  <Box borderStyle="round" paddingX={1}>
    <Text color="cyan">hello tui</Text>
  </Box>
)
```

## Public API (core)

`render`, `createRoot`, `Box`, `Text`, `Button`, `Link`, `Spacer`, `Newline`, `Ansi`, `RawAnsi`, `NoSelect`, `ThemeProvider`, `useTheme`, `useInput`, `useStdin`, `useApp`, `useInterval`, `useAnimationFrame`, `useSelection`, `useTerminalViewport`, `useTerminalFocus`, `useTerminalTitle`, `FocusManager`, `measureElement`, `wrapText`, `supportsTabStatus`.

See `examples/` for runnable demos.

## Interactive Example

Run the full showcase from `packages/tui`:

```sh
bun install
bun run example:interactive
```

That example exercises the main interactive surfaces in this package:

- `Tabs` and `Pane` for layout
- `Spinner`, `LoadingState`, and `ProgressBar` for feedback
- `TextInput` and `VimTextInput` for editing
- `CustomSelect` and `SelectMulti` for list selection
- `Markdown`, `OrderedList`, `Dialog`, `Byline`, `KeyboardShortcutHint`, and `ListItem`

Core controls inside the example:

- `1-5` jump between tabs
- `Tab`, `Left`, `Right` cycle tabs
- `Enter` activates the focused surface
- `Ctrl+G` returns from a focused editor/selector to shell navigation
- `t` toggles light and dark theme preview
- `q` exits

## Host integration

Call `configureHost({ getGlobalConfig, saveGlobalConfig, logger })` before `render()` to plug your app's config/log plumbing. Defaults: in-memory config with `{ theme: 'dark' }`, console logger.

## Publish To npm

From `packages/tui`, build and publish with your npm account:

```sh
bun run typecheck
bun test
bun run build
npm login
npm publish
```

Notes:

- `publishConfig.access` is already set to `public`, which is required for the first publish of a scoped package like `@vancityayush/tui`.
- If you want this package to be publicly reusable, replace `UNLICENSED` in `package.json` with a real license before publishing.

## License

UNLICENSED — internal/private.
