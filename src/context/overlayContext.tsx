import React, { createContext, useContext, useLayoutEffect, useEffect, useReducer, useRef } from 'react'
import instances from '../ink/instances.js'

const NON_MODAL_OVERLAYS = new Set(['autocomplete'])

type OverlayState = Set<string>
type Action = { type: 'register'; id: string } | { type: 'unregister'; id: string }

function reducer(state: OverlayState, action: Action): OverlayState {
  if (action.type === 'register') {
    if (state.has(action.id)) return state
    return new Set([...state, action.id])
  }
  if (!state.has(action.id)) return state
  const next = new Set(state)
  next.delete(action.id)
  return next
}

const OverlayContext = createContext<{
  state: OverlayState
  dispatch: React.Dispatch<Action>
} | null>(null)

export function OverlayProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(reducer, new Set<string>())
  return React.createElement(OverlayContext.Provider, { value: { state, dispatch } }, children)
}

export function useRegisterOverlay(id: string, enabled = true): void {
  const ctx = useContext(OverlayContext)
  const dispatch = ctx?.dispatch
  useEffect(() => {
    if (!enabled || !dispatch) return
    dispatch({ type: 'register', id })
    return () => dispatch({ type: 'unregister', id })
  }, [id, enabled, dispatch])

  useLayoutEffect(() => {
    if (!enabled) return
    return () => {
      instances.get(process.stdout)?.invalidatePrevFrame()
    }
  }, [enabled])
}

export function useIsOverlayActive(): boolean {
  const ctx = useContext(OverlayContext)
  return (ctx?.state.size ?? 0) > 0
}

export function useIsModalOverlayActive(): boolean {
  const ctx = useContext(OverlayContext)
  if (!ctx) return false
  for (const id of ctx.state) {
    if (!NON_MODAL_OVERLAYS.has(id)) return true
  }
  return false
}
