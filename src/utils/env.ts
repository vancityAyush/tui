import memoize from 'lodash-es/memoize.js'
import { readFileSync } from 'fs'

type Platform = 'win32' | 'darwin' | 'linux'

const JETBRAINS_IDES = [
  'pycharm', 'intellij', 'webstorm', 'phpstorm', 'rubymine', 'clion',
  'goland', 'rider', 'datagrip', 'appcode', 'dataspell', 'aqua',
  'gateway', 'fleet', 'jetbrains', 'androidstudio',
]

function isSSHSession(): boolean {
  return !!(process.env.SSH_CLIENT || process.env.SSH_TTY || process.env.SSH_CONNECTION)
}

const isWslEnvironment = memoize((): boolean => {
  try {
    readFileSync('/proc/sys/fs/binfmt_misc/WSLInterop')
    return true
  } catch {
    return false
  }
})

const isNpmFromWindowsPath = memoize((): boolean => false)

function isConductor(): boolean {
  return process.env.__CFBundleIdentifier === 'com.conductor.app'
}

function detectTerminal(): string | null {
  if (process.env.CURSOR_TRACE_ID) return 'cursor'
  if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes('cursor')) return 'cursor'
  if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes('windsurf')) return 'windsurf'
  if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes('antigravity')) return 'antigravity'
  const bundleId = process.env.__CFBundleIdentifier?.toLowerCase()
  if (bundleId?.includes('vscodium')) return 'codium'
  if (bundleId?.includes('windsurf')) return 'windsurf'
  if (bundleId?.includes('com.google.android.studio')) return 'androidstudio'
  if (bundleId) {
    for (const ide of JETBRAINS_IDES) {
      if (bundleId.includes(ide)) return ide
    }
  }
  if (process.env.VisualStudioVersion) return 'visualstudio'
  if (process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm') return 'pycharm'
  if (process.env.TERM === 'xterm-ghostty') return 'ghostty'
  if (process.env.TERM?.includes('kitty')) return 'kitty'
  if (process.env.TERM_PROGRAM) return process.env.TERM_PROGRAM
  if (process.env.TMUX) return 'tmux'
  if (process.env.STY) return 'screen'
  if (process.env.KONSOLE_VERSION) return 'konsole'
  if (process.env.GNOME_TERMINAL_SERVICE) return 'gnome-terminal'
  if (process.env.XTERM_VERSION) return 'xterm'
  if (process.env.VTE_VERSION) return 'vte-based'
  if (process.env.TERMINATOR_UUID) return 'terminator'
  if (process.env.KITTY_WINDOW_ID) return 'kitty'
  if (process.env.ALACRITTY_LOG) return 'alacritty'
  if (process.env.TILIX_ID) return 'tilix'
  if (process.env.WT_SESSION) return 'windows-terminal'
  if (process.env.SESSIONNAME && process.env.TERM === 'cygwin') return 'cygwin'
  if (process.env.MSYSTEM) return process.env.MSYSTEM.toLowerCase()
  if (process.env.ConEmuANSI || process.env.ConEmuPID || process.env.ConEmuTask) return 'conemu'
  if (process.env.WSL_DISTRO_NAME) return `wsl-${process.env.WSL_DISTRO_NAME}`
  if (isSSHSession()) return 'ssh-session'
  if (process.env.TERM) {
    const term = process.env.TERM
    if (term.includes('alacritty')) return 'alacritty'
    if (term.includes('rxvt')) return 'rxvt'
    if (term.includes('termite')) return 'termite'
    return process.env.TERM
  }
  if (!process.stdout.isTTY) return 'non-interactive'
  return null
}

export const env = {
  hasInternetAccess: async () => false,
  isCI: !!(process.env.CI),
  platform: (['win32', 'darwin'].includes(process.platform) ? process.platform : 'linux') as Platform,
  arch: process.arch,
  nodeVersion: process.version,
  terminal: detectTerminal(),
  isSSH: isSSHSession,
  getPackageManagers: async () => ({}),
  getRuntimes: async () => ({}),
  isRunningWithBun: memoize((): boolean => typeof (globalThis as Record<string, unknown>).Bun !== 'undefined'),
  isWslEnvironment,
  isNpmFromWindowsPath,
  isConductor,
  detectDeploymentEnvironment: memoize(() => 'unknown'),
}
