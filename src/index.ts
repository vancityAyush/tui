import { createElement, type ReactNode } from 'react'
import { ThemeProvider } from './components/design-system/ThemeProvider.js'
import inkRender, {
  type Instance,
  createRoot as inkCreateRoot,
  type RenderOptions,
  type Root,
} from './ink/root.js'

export type { RenderOptions, Instance, Root }

// Wrap all CC render calls with ThemeProvider so ThemedBox/ThemedText work
// without every call site having to mount it. Ink itself is theme-agnostic.
function withTheme(node: ReactNode): ReactNode {
  return createElement(ThemeProvider, null, node)
}

export async function render(
  node: ReactNode,
  options?: NodeJS.WriteStream | RenderOptions,
): Promise<Instance> {
  return inkRender(withTheme(node), options)
}

export async function createRoot(options?: RenderOptions): Promise<Root> {
  const root = await inkCreateRoot(options)
  return {
    ...root,
    render: node => root.render(withTheme(node)),
  }
}

export { color } from './components/design-system/color.js'
export type { Props as BoxProps } from './components/design-system/ThemedBox.js'
export { default as Box } from './components/design-system/ThemedBox.js'
export type { Props as TextProps } from './components/design-system/ThemedText.js'
export { default as Text } from './components/design-system/ThemedText.js'
export {
  ThemeProvider,
  usePreviewTheme,
  useTheme,
  useThemeSetting,
} from './components/design-system/ThemeProvider.js'
export { Ansi } from './ink/Ansi.js'
export type { Props as AppProps } from './ink/components/AppContext.js'
export type { Props as BaseBoxProps } from './ink/components/Box.js'
export { default as BaseBox } from './ink/components/Box.js'
export type {
  ButtonState,
  Props as ButtonProps,
} from './ink/components/Button.js'
export { default as Button } from './ink/components/Button.js'
export type { Props as LinkProps } from './ink/components/Link.js'
export { default as Link } from './ink/components/Link.js'
export type { Props as NewlineProps } from './ink/components/Newline.js'
export { default as Newline } from './ink/components/Newline.js'
export { NoSelect } from './ink/components/NoSelect.js'
export { RawAnsi } from './ink/components/RawAnsi.js'
export { default as Spacer } from './ink/components/Spacer.js'
export type { Props as StdinProps } from './ink/components/StdinContext.js'
export type { Props as BaseTextProps } from './ink/components/Text.js'
export { default as BaseText } from './ink/components/Text.js'
export type { DOMElement } from './ink/dom.js'
export { ClickEvent } from './ink/events/click-event.js'
export { EventEmitter } from './ink/events/emitter.js'
export { Event } from './ink/events/event.js'
export type { Key } from './ink/events/input-event.js'
export { InputEvent } from './ink/events/input-event.js'
export type { TerminalFocusEventType } from './ink/events/terminal-focus-event.js'
export { TerminalFocusEvent } from './ink/events/terminal-focus-event.js'
export { FocusManager } from './ink/focus.js'
export type { FlickerReason } from './ink/frame.js'
export { useAnimationFrame } from './ink/hooks/use-animation-frame.js'
export { default as useApp } from './ink/hooks/use-app.js'
export { default as useInput } from './ink/hooks/use-input.js'
export { useAnimationTimer, useInterval } from './ink/hooks/use-interval.js'
export { useSelection } from './ink/hooks/use-selection.js'
export { default as useStdin } from './ink/hooks/use-stdin.js'
export { useTabStatus } from './ink/hooks/use-tab-status.js'
export { useTerminalFocus } from './ink/hooks/use-terminal-focus.js'
export { useTerminalTitle } from './ink/hooks/use-terminal-title.js'
export { useTerminalViewport } from './ink/hooks/use-terminal-viewport.js'
export { default as measureElement } from './ink/measure-element.js'
export { supportsTabStatus } from './ink/termio/osc.js'
export { default as wrapText } from './ink/wrap-text.js'

// ── Host integration ──────────────────────────────────────────────────────────
export type { FeatureFlag } from './config/features.js'
export { setFeatures, feature } from './config/features.js'
export type { GlobalConfig, HostConfig, HistoryEntry, PastedContent } from './utils/config.js'
export { configureHost, getGlobalConfig, saveGlobalConfig } from './utils/config.js'

// ── Design-system components ──────────────────────────────────────────────────
export { Byline } from './components/design-system/Byline.js'
export { Dialog } from './components/design-system/Dialog.js'
export { Divider } from './components/design-system/Divider.js'
export { FuzzyPicker } from './components/design-system/FuzzyPicker.js'
export { KeyboardShortcutHint } from './components/design-system/KeyboardShortcutHint.js'
export { ListItem } from './components/design-system/ListItem.js'
export { LoadingState } from './components/design-system/LoadingState.js'
export { Pane } from './components/design-system/Pane.js'
export { ProgressBar } from './components/design-system/ProgressBar.js'
export { Ratchet } from './components/design-system/Ratchet.js'
export { StatusIcon } from './components/design-system/StatusIcon.js'
export { Tab, Tabs, useTabHeaderFocus, useTabsWidth } from './components/design-system/Tabs.js'
export { BaseTextInput } from './components/BaseTextInput.js'
export { FilePathLink } from './components/FilePathLink.js'
export { PressEnterToContinue } from './components/PressEnterToContinue.js'
export { default as Spinner } from './components/Spinner.js'
export { default as TextInput } from './components/TextInput.js'
export { ToolUseLoader } from './components/ToolUseLoader.js'
export { default as VimTextInput } from './components/VimTextInput.js'

// ── Keybinding engine ─────────────────────────────────────────────────────────
export type {
  Chord,
  KeybindingAction,
  KeybindingBlock,
  KeybindingContextName,
  ParsedBinding,
  ParsedKeystroke,
} from './keybindings/types.js'
export { KeybindingProvider, useKeybindingContext, useOptionalKeybindingContext, useRegisterKeybindingContext } from './keybindings/KeybindingContext.js'
export { KeybindingSetup } from './keybindings/KeybindingProviderSetup.js'
export { useKeybinding, useKeybindings } from './keybindings/useKeybinding.js'
export { getShortcutDisplay } from './keybindings/shortcutFormat.js'
export { useShortcutDisplay } from './keybindings/useShortcutDisplay.js'
export type { KeybindingsLoadResult } from './keybindings/loadUserBindings.js'
export {
  DEFAULT_BINDINGS,
} from './keybindings/defaultBindings.js'
export {
  disposeKeybindingWatcher,
  getCachedKeybindingWarnings,
  getKeybindingsPath,
  initializeKeybindingWatcher,
  isKeybindingCustomizationEnabled,
  loadKeybindings,
  loadKeybindingsSync,
  loadKeybindingsSyncWithWarnings,
  subscribeToKeybindingChanges,
} from './keybindings/loadUserBindings.js'

// ── Vim engine ────────────────────────────────────────────────────────────────
export type {
  CommandState,
  FindType,
  Operator,
  PersistentState,
  RecordedChange,
  TextObjScope,
  VimState,
} from './vim/types.js'
export {
  FIND_KEYS,
  MAX_VIM_COUNT,
  OPERATORS,
  SIMPLE_MOTIONS,
  TEXT_OBJ_SCOPES,
  TEXT_OBJ_TYPES,
  createInitialPersistentState,
  createInitialVimState,
  isOperatorKey,
  isTextObjScopeKey,
} from './vim/types.js'
export type { TransitionContext, TransitionResult } from './vim/transitions.js'
export { transition } from './vim/transitions.js'

// ── Context providers ─────────────────────────────────────────────────────────
export {
  OverlayProvider,
  useIsModalOverlayActive,
  useIsOverlayActive,
  useRegisterOverlay,
} from './context/overlayContext.js'
export type { Notification } from './context/notifications.js'
export {
  NotificationsProvider,
  getNext,
  useNotifications,
  useOptionalNotifications,
} from './context/notifications.js'
export type { PromptOverlayData, SuggestionItem } from './context/promptOverlayContext.js'
export {
  PromptOverlayProvider,
  usePromptOverlay,
  usePromptOverlayDialog,
  useSetPromptOverlay,
  useSetPromptOverlayDialog,
} from './context/promptOverlayContext.js'
export { ModalContext, useIsInsideModal, useModalOrTerminalSize, useModalScrollRef } from './context/modalContext.js'
export { FpsMetricsProvider, useFpsMetrics } from './context/fpsMetrics.js'
export { MailboxProvider, useMailbox } from './context/mailbox.js'

// ── Markdown rendering ───────────────────────────────────────────────────────
export { Markdown, StreamingMarkdown } from './components/Markdown.js'
export { MarkdownTable } from './components/MarkdownTable.js'
export {
  applyMarkdown,
  configureMarked,
  formatToken,
  padAligned,
} from './utils/markdown.js'
export type { CliHighlight } from './utils/cliHighlight.js'
export { getCliHighlightPromise, getLanguageName } from './utils/cliHighlight.js'
export { stripPromptXMLTags } from './utils/stripPromptXMLTags.js'
export { createHyperlink, OSC8_START, OSC8_END } from './utils/hyperlink.js'

// ── Syntax-highlighted code ──────────────────────────────────────────────────
export { HighlightedCode } from './components/HighlightedCode.js'
export { HighlightedCodeFallback } from './components/HighlightedCode/Fallback.js'
export { StructuredDiff } from './components/StructuredDiff.js'
export { StructuredDiffFallback } from './components/StructuredDiff/Fallback.js'
export {
  expectColorDiff,
  expectColorFile,
  getColorModuleUnavailableReason,
  getSyntaxTheme,
} from './components/StructuredDiff/colorDiff.js'
export type { ColorModuleUnavailableReason } from './components/StructuredDiff/colorDiff.js'

// ── Lists & selection ────────────────────────────────────────────────────────
export { OrderedList } from './components/ui/OrderedList.js'
export { OrderedListItem } from './components/ui/OrderedListItem.js'
export { Select as CustomSelect } from './components/CustomSelect/select.js'
export type { OptionWithDescription, SelectProps } from './components/CustomSelect/select.js'
export { SelectMulti } from './components/CustomSelect/SelectMulti.js'
export type { SelectMultiProps } from './components/CustomSelect/SelectMulti.js'

// ── ANSI → image / XML ───────────────────────────────────────────────────────
export { ansiToSvg } from './utils/ansiToSvg.js'
export { ansiToPng } from './utils/ansiToPng.js'
export { escapeXml } from './utils/xml.js'

// ── Image clickable refs ─────────────────────────────────────────────────────
export { ClickableImageRef } from './components/ClickableImageRef.js'

// ── Small utilities ──────────────────────────────────────────────────────────
export { djb2Hash, hashContent, hashPair } from './utils/hash.js'
export { convertLeadingTabsToSpaces } from './utils/file.js'
export {
  MACOS_OPTION_SPECIAL_CHARS,
  isMacosOptionChar,
} from './utils/keyboardShortcuts.js'
export { useAfterFirstRender } from './hooks/useAfterFirstRender.js'

// ── Input primitives ─────────────────────────────────────────────────────────
export type {
  BaseInputState,
  BaseTextInputProps,
  InlineGhostText,
  TextInputState,
  VimInputState,
  VimMode,
  VimTextInputProps,
} from './types/textInputTypes.js'
export type { TextHighlight } from './utils/textHighlighting.js'
export { useTextInput } from './hooks/useTextInput.js'
export { useVimInput } from './hooks/useVimInput.js'
