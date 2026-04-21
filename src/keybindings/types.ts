export type KeybindingContextName = string
export type KeybindingAction = string

export type ParsedKeystroke = {
  key: string
  ctrl: boolean
  alt: boolean
  shift: boolean
  meta: boolean
  super: boolean
}

export type Chord = ParsedKeystroke[]

export type ParsedBinding = {
  action: string | null
  context: KeybindingContextName
  chord: Chord
  source?: 'user' | 'default'
}

export type KeybindingBlock = {
  context: KeybindingContextName
  bindings: Record<string, string | null>
}
