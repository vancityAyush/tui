# @vancityayush/tui

Rich React + Yoga terminal UI engine, extracted from the Claude Code CLI.

Superset of the upstream `ink` package: synchronized output, alt-screen, hyperlink pooling, focus manager, selection/copy, terminal-focus events, tab-status, bidi support, FPS tracking, theming, keybinding engine, and vim-mode input.

## Status

v0.1 — lifted verbatim from source, couplings stubbed. Bun-only for now (uses Bun FFI for Yoga native layout).

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

## Host integration

Call `configureHost({ getGlobalConfig, saveGlobalConfig, logger })` before `render()` to plug your app's config/log plumbing. Defaults: in-memory config with `{ theme: 'dark' }`, console logger.

## License

UNLICENSED — internal/private.
