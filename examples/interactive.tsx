import React, { useMemo, useState } from 'react'
import {
  Box,
  Byline,
  CustomSelect,
  Dialog,
  Divider,
  KeyboardShortcutHint,
  Link,
  ListItem,
  LoadingState,
  Markdown,
  OrderedList,
  OrderedListItem,
  Pane,
  ProgressBar,
  SelectMulti,
  Spinner,
  Tab,
  Tabs,
  Text,
  TextInput,
  ThemeProvider,
  VimTextInput,
  render,
  useApp,
  useInput,
  useInterval,
  useTheme,
} from '../src/index.js'

type TabId = 'overview' | 'inputs' | 'selectors' | 'markdown' | 'overlay'
type InputVariant = 'text' | 'vim'
type SelectorVariant = 'single' | 'multi'

const TAB_ORDER: TabId[] = [
  'overview',
  'inputs',
  'selectors',
  'markdown',
  'overlay',
]

const OVERVIEW_ACTIONS = [
  'Toggle theme preview',
  'Jump to markdown tab',
  'Open confirmation dialog',
] as const

const SINGLE_SELECT_OPTIONS = [
  {
    label: 'Starter',
    value: 'starter',
    description: 'Minimal building blocks for a tiny CLI.',
  },
  {
    label: 'Productive',
    value: 'productive',
    description: 'Balanced defaults for real interactive tools.',
  },
  {
    label: 'Power user',
    value: 'power-user',
    description: 'Dense UI with vim-style editing and shortcuts.',
  },
  {
    label: 'Operator',
    value: 'operator',
    description: 'Task-focused flows for long-running terminal sessions.',
  },
] as const

const MULTI_SELECT_OPTIONS = [
  {
    label: 'Tabs',
    value: 'tabs',
    description: 'Top-level surface switching.',
  },
  {
    label: 'Inputs',
    value: 'inputs',
    description: 'Prompt-style and vim-style editing.',
  },
  {
    label: 'Markdown',
    value: 'markdown',
    description: 'Rich docs and code blocks.',
  },
  {
    label: 'Dialogs',
    value: 'dialogs',
    description: 'Inline confirmation and decision flows.',
  },
  {
    label: 'Progress',
    value: 'progress',
    description: 'Animated status and long task feedback.',
  },
] as const

const SAMPLE_MARKDOWN = `# Shipping a serious TUI

> This example stays keyboard-first and keeps focus rules explicit.

## Why this demo exists

- Show the layout primitives in a realistic shell.
- Exercise input, selection, markdown, dialogs, and theming.
- Stay runnable directly from \`examples/\`.

\`\`\`ts
const { waitUntilExit } = await render(<InteractiveExample />)
await waitUntilExit()
\`\`\`

| Surface | Components |
| --- | --- |
| Navigation | Tabs, Tab, Byline, KeyboardShortcutHint |
| Editing | TextInput, VimTextInput |
| Selection | CustomSelect, SelectMulti, ListItem |
| Feedback | Spinner, LoadingState, ProgressBar, Dialog |
`

function cycleTab(current: TabId, direction: 1 | -1): TabId {
  const index = TAB_ORDER.indexOf(current)
  const nextIndex = (index + TAB_ORDER.length + direction) % TAB_ORDER.length
  return TAB_ORDER[nextIndex]!
}

function interactiveLabel(active: boolean, label: string): React.ReactNode {
  return (
    <Text color={active ? 'suggestion' : undefined} bold={active}>
      {label}
    </Text>
  )
}

function OverviewTab({
  actionIndex,
  progress,
  activeTheme,
  status,
}: {
  actionIndex: number
  progress: number
  activeTheme: string
  status: string
}): React.ReactNode {
  return (
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="column" gap={1}>
        <Text bold color="claude">
          Interactive surface overview
        </Text>
        <Text dimColor>
          The example keeps global navigation separate from text-entry mode so
          the controls are predictable.
        </Text>
      </Box>

      <Divider title="Live feedback" />

      <Box flexDirection="column" gap={1}>
        <LoadingState
          message="Rendering the showcase shell"
          subtitle="Spinner, progress, tabs, and markdown are all live."
        />
        <Spinner label="Shared clock animation is active" />
        <Box flexDirection="row" gap={2}>
          <Text>Render progress</Text>
          <ProgressBar
            ratio={progress}
            width={28}
            fillColor="success"
            emptyColor="subtle"
          />
          <Text color="success">{Math.round(progress * 100)}%</Text>
        </Box>
      </Box>

      <Divider title="Keyboard actions" />

      <Box flexDirection="column">
        {OVERVIEW_ACTIONS.map((action, index) => (
          <ListItem
            key={action}
            isFocused={actionIndex === index}
            isSelected={actionIndex === index}
            description={
              index === 0
                ? `Current theme: ${activeTheme}`
                : index === 1
                  ? 'Shows Markdown + OrderedList + shortcut bylines.'
                  : 'Opens the Dialog component and confirms with Enter.'
            }
          >
            {action}
          </ListItem>
        ))}
      </Box>

      <Divider title="Links" />

      <Text>
        Package manager ecosystem:{' '}
        <Link url="https://bun.sh">bun.sh</Link>
        {'  '}and registry publishing via{' '}
        <Link url="https://www.npmjs.com/">npm</Link>
      </Text>

      <Text dimColor>Status: {status}</Text>
    </Box>
  )
}

function InputsTab({
  activeVariant,
  inputMode,
  textValue,
  textCursorOffset,
  setTextCursorOffset,
  setTextValue,
  onTextSubmit,
  lastSubmittedText,
  vimValue,
  vimCursorOffset,
  setVimCursorOffset,
  setVimValue,
  onVimSubmit,
  lastSubmittedVim,
  vimMode,
  setVimMode,
}: {
  activeVariant: InputVariant
  inputMode: boolean
  textValue: string
  textCursorOffset: number
  setTextCursorOffset: (offset: number) => void
  setTextValue: (value: string) => void
  onTextSubmit: (value: string) => void
  lastSubmittedText: string
  vimValue: string
  vimCursorOffset: number
  setVimCursorOffset: (offset: number) => void
  setVimValue: (value: string) => void
  onVimSubmit: (value: string) => void
  lastSubmittedVim: string
  vimMode: 'INSERT' | 'NORMAL'
  setVimMode: (mode: 'INSERT' | 'NORMAL') => void
}): React.ReactNode {
  const textActive = inputMode && activeVariant === 'text'
  const vimActive = inputMode && activeVariant === 'vim'

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="claude">
        Prompt editing
      </Text>

      <Text dimColor>
        Use left and right while not editing to switch editors. Press Enter to
        focus the selected editor, then use Ctrl+G to hand control back to the
        example shell.
      </Text>

      <Box flexDirection="row" gap={1}>
        {interactiveLabel(activeVariant === 'text', '[TextInput]')}
        {interactiveLabel(activeVariant === 'vim', '[VimTextInput]')}
      </Box>

      <Divider title="Single-line prompt" />

      <Box flexDirection="column" gap={1}>
        <Text dimColor>
          Submission preview: {lastSubmittedText || '(nothing submitted yet)'}
        </Text>
        <TextInput
          value={textValue}
          onChange={setTextValue}
          onSubmit={onTextSubmit}
          placeholder="Describe the TUI you want to build"
          focus={textActive}
          showCursor
          columns={56}
          cursorOffset={textCursorOffset}
          onChangeCursorOffset={setTextCursorOffset}
        />
      </Box>

      <Divider title="Vim-mode editor" />

      <Box flexDirection="column" gap={1}>
        <Text dimColor>
          Mode: {vimMode} · Last submission:{' '}
          {lastSubmittedVim || '(nothing submitted yet)'}
        </Text>
        <VimTextInput
          value={vimValue}
          onChange={setVimValue}
          onSubmit={onVimSubmit}
          onModeChange={setVimMode}
          initialMode="INSERT"
          placeholder="Write a multi-line release note"
          multiline
          maxVisibleLines={4}
          focus={vimActive}
          showCursor
          columns={56}
          cursorOffset={vimCursorOffset}
          onChangeCursorOffset={setVimCursorOffset}
        />
      </Box>
    </Box>
  )
}

function SelectorsTab({
  activeVariant,
  selectorMode,
  selectedPreset,
  selectedFeatures,
  appliedFeatures,
  onPresetChange,
  onFeaturesChange,
  onSelectorCancel,
  onSelectorSubmit,
}: {
  activeVariant: SelectorVariant
  selectorMode: boolean
  selectedPreset: string
  selectedFeatures: string[]
  appliedFeatures: string[]
  onPresetChange: (value: string) => void
  onFeaturesChange: (values: string[]) => void
  onSelectorCancel: () => void
  onSelectorSubmit: (values: string[]) => void
}): React.ReactNode {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="claude">
        Selection widgets
      </Text>
      <Text dimColor>
        Use left and right while browsing to switch between selectors. Press
        Enter to activate the selected widget. Escape cancels selector focus.
      </Text>

      <Box flexDirection="row" gap={1}>
        {interactiveLabel(activeVariant === 'single', '[CustomSelect]')}
        {interactiveLabel(activeVariant === 'multi', '[SelectMulti]')}
      </Box>

      <Divider title="Single-choice preset" />

      <CustomSelect
        isDisabled={!selectorMode || activeVariant !== 'single'}
        options={SINGLE_SELECT_OPTIONS}
        defaultValue={selectedPreset}
        onChange={onPresetChange}
        onCancel={onSelectorCancel}
        visibleOptionCount={4}
      />

      <Text dimColor>Selected preset: {selectedPreset}</Text>

      <Divider title="Multi-choice feature mix" />

      <SelectMulti
        isDisabled={!selectorMode || activeVariant !== 'multi'}
        options={MULTI_SELECT_OPTIONS}
        defaultValue={selectedFeatures}
        onChange={onFeaturesChange}
        onCancel={onSelectorCancel}
        onSubmit={onSelectorSubmit}
        submitButtonText="Apply feature mix"
        visibleOptionCount={5}
      />

      <Text dimColor>
        Applied feature set:{' '}
        {appliedFeatures.length > 0 ? appliedFeatures.join(', ') : '(none yet)'}
      </Text>
    </Box>
  )
}

function MarkdownTab(): React.ReactNode {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="claude">
        Markdown and numbered content
      </Text>
      <Markdown>{SAMPLE_MARKDOWN}</Markdown>

      <Divider title="Implementation notes" />

      <OrderedList>
        <OrderedListItem>
          Keep global navigation and local editing focus separate.
        </OrderedListItem>
        <OrderedListItem>
          Give every interactive region a clear escape hatch.
        </OrderedListItem>
        <OrderedListItem>
          Prefer example code that can run directly from the package.
        </OrderedListItem>
      </OrderedList>
    </Box>
  )
}

function OverlayTab({
  status,
  dialogOpen,
}: {
  status: string
  dialogOpen: boolean
}): React.ReactNode {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="claude">
        Inline dialog flow
      </Text>
      <Text dimColor>
        Press Enter from this tab to open the dialog. Confirm with Enter or
        dismiss with Escape.
      </Text>

      <Pane color="permission">
        <Box flexDirection="column" gap={1}>
          <Text>
            Dialogs are useful when a destructive or cross-cutting decision
            needs a dedicated confirmation surface.
          </Text>
          <Text dimColor>Current outcome: {status}</Text>
        </Box>
      </Pane>

      {dialogOpen && (
        <Dialog
          title="Apply demo configuration?"
          subtitle="This is an inline example of the Dialog component."
          onCancel={() => {}}
        >
          <Text>
            Confirming marks the demo as applied. Cancelling keeps the current
            state untouched.
          </Text>
        </Dialog>
      )}
    </Box>
  )
}

function InteractiveExampleShell(): React.ReactNode {
  const { exit } = useApp()
  const [theme, setTheme] = useTheme()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [overviewActionIndex, setOverviewActionIndex] = useState(0)
  const [status, setStatus] = useState('Ready')
  const [progress, setProgress] = useState(0.12)

  const [inputVariant, setInputVariant] = useState<InputVariant>('text')
  const [inputMode, setInputMode] = useState(false)
  const [textValue, setTextValue] = useState('Ship a polished terminal UI')
  const [textSubmitted, setTextSubmitted] = useState('')
  const [textCursorOffset, setTextCursorOffset] = useState(textValue.length)
  const [vimValue, setVimValue] = useState(
    'Release notes:\n- keyboard navigation\n- markdown rendering',
  )
  const [vimSubmitted, setVimSubmitted] = useState('')
  const [vimCursorOffset, setVimCursorOffset] = useState(vimValue.length)
  const [vimMode, setVimMode] = useState<'INSERT' | 'NORMAL'>('INSERT')

  const [selectorVariant, setSelectorVariant] =
    useState<SelectorVariant>('single')
  const [selectorMode, setSelectorMode] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>('productive')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'tabs',
    'markdown',
  ])
  const [appliedFeatures, setAppliedFeatures] = useState<string[]>([
    'tabs',
    'markdown',
  ])

  const [dialogOpen, setDialogOpen] = useState(false)

  useInterval(() => {
    setProgress(value => {
      const next = value + 0.04
      return next > 1 ? 0.08 : next
    })
  }, 140)

  const overviewTitle = useMemo(
    () => `${TAB_ORDER.indexOf(activeTab) + 1}. ${activeTab}`,
    [activeTab],
  )

  function toggleTheme(): void {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    setStatus(`Theme switched to ${nextTheme}`)
  }

  function triggerOverviewAction(index: number): void {
    if (index === 0) {
      toggleTheme()
      return
    }
    if (index === 1) {
      setActiveTab('markdown')
      setStatus('Jumped to markdown showcase')
      return
    }
    setActiveTab('overlay')
    setDialogOpen(true)
    setStatus('Confirmation dialog opened')
  }

  function openFocusedInput(): void {
    setInputMode(true)
    setStatus(
      inputVariant === 'text'
        ? 'TextInput captured keyboard input'
        : 'VimTextInput captured keyboard input',
    )
  }

  function leaveInputMode(): void {
    setInputMode(false)
    setStatus('Returned to shell navigation')
  }

  function openFocusedSelector(): void {
    setSelectorMode(true)
    setStatus(
      selectorVariant === 'single'
        ? 'CustomSelect captured keyboard input'
        : 'SelectMulti captured keyboard input',
    )
  }

  function leaveSelectorMode(): void {
    setSelectorMode(false)
    setStatus('Returned to shell navigation')
  }

  useInput(
    (input, key) => {
      if (key.ctrl && input === 'c') {
        exit()
        return
      }

      if (input === 'q') {
        exit()
        return
      }

      if (key.tab || key.rightArrow) {
        setActiveTab(current => cycleTab(current, 1))
        return
      }

      if (key.leftArrow) {
        setActiveTab(current => cycleTab(current, -1))
        return
      }

      if (/^[1-5]$/.test(input)) {
        setActiveTab(TAB_ORDER[Number(input) - 1]!)
        return
      }

      if (input === 't') {
        toggleTheme()
        return
      }

      if (activeTab === 'overview') {
        if (key.downArrow) {
          setOverviewActionIndex(index =>
            (index + 1) % OVERVIEW_ACTIONS.length,
          )
          return
        }

        if (key.upArrow) {
          setOverviewActionIndex(index =>
            (index + OVERVIEW_ACTIONS.length - 1) % OVERVIEW_ACTIONS.length,
          )
          return
        }

        if (key.return) {
          triggerOverviewAction(overviewActionIndex)
        }
        return
      }

      if (activeTab === 'inputs') {
        if (key.leftArrow || input === 'h') {
          setInputVariant('text')
          return
        }

        if (key.rightArrow || input === 'l') {
          setInputVariant('vim')
          return
        }

        if (key.return) {
          openFocusedInput()
        }
        return
      }

      if (activeTab === 'selectors') {
        if (key.leftArrow || input === 'h') {
          setSelectorVariant('single')
          return
        }

        if (key.rightArrow || input === 'l') {
          setSelectorVariant('multi')
          return
        }

        if (key.return) {
          openFocusedSelector()
        }
        return
      }

      if (activeTab === 'overlay' && key.return) {
        setDialogOpen(true)
        setStatus('Confirmation dialog opened')
      }
    },
    {
      isActive: !dialogOpen && !inputMode && !selectorMode,
    },
  )

  useInput(
    (input, key) => {
      if (key.ctrl && input === 'g') {
        leaveInputMode()
      }
    },
    { isActive: inputMode },
  )

  useInput(
    (input, key) => {
      if (key.ctrl && input === 'g') {
        leaveSelectorMode()
      }
    },
    { isActive: selectorMode },
  )

  useInput(
    (_input, key) => {
      if (key.escape) {
        setDialogOpen(false)
        setStatus('Dialog cancelled')
        return
      }

      if (key.return) {
        setDialogOpen(false)
        setStatus('Dialog confirmed')
      }
    },
    { isActive: dialogOpen },
  )

  return (
    <Pane color="claude">
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="column">
          <Text bold color="claude">
            Full Interactive TUI Example
          </Text>
          <Text dimColor>
            Theme: {theme} · Active surface: {overviewTitle}
          </Text>
        </Box>

        <Tabs
          title="Showcase"
          selectedTab={activeTab}
          disableNavigation
          useFullWidth
          banner={
            <Text dimColor>
              <Byline>
                <KeyboardShortcutHint shortcut="1-5" action="jump tabs" />
                <KeyboardShortcutHint shortcut="Tab/←/→" action="cycle tabs" />
                <KeyboardShortcutHint shortcut="t" action="toggle theme" />
                <KeyboardShortcutHint shortcut="q" action="exit" />
              </Byline>
            </Text>
          }
        >
          <Tab id="overview" title="Overview">
            <OverviewTab
              actionIndex={overviewActionIndex}
              progress={progress}
              activeTheme={theme}
              status={status}
            />
          </Tab>
          <Tab id="inputs" title="Inputs">
            <InputsTab
              activeVariant={inputVariant}
              inputMode={inputMode}
              textValue={textValue}
              textCursorOffset={textCursorOffset}
              setTextCursorOffset={setTextCursorOffset}
              setTextValue={setTextValue}
              onTextSubmit={value => {
                setTextSubmitted(value)
                setStatus(`Submitted text prompt: ${value || '(empty)'}`)
              }}
              lastSubmittedText={textSubmitted}
              vimValue={vimValue}
              vimCursorOffset={vimCursorOffset}
              setVimCursorOffset={setVimCursorOffset}
              setVimValue={setVimValue}
              onVimSubmit={value => {
                setVimSubmitted(value)
                setStatus('Submitted vim editor content')
              }}
              lastSubmittedVim={vimSubmitted}
              vimMode={vimMode}
              setVimMode={setVimMode}
            />
          </Tab>
          <Tab id="selectors" title="Selectors">
            <SelectorsTab
              activeVariant={selectorVariant}
              selectorMode={selectorMode}
              selectedPreset={selectedPreset}
              selectedFeatures={selectedFeatures}
              appliedFeatures={appliedFeatures}
              onPresetChange={value => {
                setSelectedPreset(value)
                setStatus(`Selected preset: ${value}`)
              }}
              onFeaturesChange={values => {
                setSelectedFeatures(values)
              }}
              onSelectorCancel={leaveSelectorMode}
              onSelectorSubmit={values => {
                setAppliedFeatures(values)
                leaveSelectorMode()
                setStatus(
                  values.length > 0
                    ? `Applied feature mix: ${values.join(', ')}`
                    : 'Cleared feature mix',
                )
              }}
            />
          </Tab>
          <Tab id="markdown" title="Markdown">
            <MarkdownTab />
          </Tab>
          <Tab id="overlay" title="Overlay">
            <OverlayTab status={status} dialogOpen={dialogOpen} />
          </Tab>
        </Tabs>

        <Divider />

        <Text dimColor>
          <Byline>
            <KeyboardShortcutHint shortcut="Enter" action="activate the focused surface" />
            {(inputMode || selectorMode) && (
              <KeyboardShortcutHint shortcut="Ctrl+G" action="return to shell navigation" />
            )}
            {selectorMode && (
              <KeyboardShortcutHint shortcut="Esc" action="cancel select mode" />
            )}
            {dialogOpen && (
              <KeyboardShortcutHint shortcut="Enter/Esc" action="confirm or cancel dialog" />
            )}
          </Byline>
        </Text>
      </Box>
    </Pane>
  )
}

function InteractiveExample(): React.ReactNode {
  return (
    <ThemeProvider initialState="dark" onThemeSave={() => {}}>
      <InteractiveExampleShell />
    </ThemeProvider>
  )
}

const { unmount, waitUntilExit } = await render(<InteractiveExample />)

if (!process.stdin.isTTY) {
  setTimeout(() => {
    unmount()
    process.exit(0)
  }, 900)
}

await waitUntilExit()
