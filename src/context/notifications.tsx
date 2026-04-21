import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react'
import type { Theme } from '../utils/theme.js'

type Priority = 'low' | 'medium' | 'high' | 'immediate'

type BaseNotification = {
  key: string
  invalidates?: string[]
  priority: Priority
  timeoutMs?: number
  fold?: (accumulator: Notification, incoming: Notification) => Notification
}
type TextNotification = BaseNotification & { text: string; color?: keyof Theme }
type JSXNotification = BaseNotification & { jsx: React.ReactNode }
export type Notification = TextNotification | JSXNotification

const PRIORITIES: Record<Priority, number> = { immediate: 0, high: 1, medium: 2, low: 3 }
export function getNext(queue: Notification[]): Notification | undefined {
  if (queue.length === 0) return undefined
  return queue.reduce((min, n) => PRIORITIES[n.priority] < PRIORITIES[min.priority] ? n : min)
}

const DEFAULT_TIMEOUT_MS = 8000

type NotifState = { current: Notification | null; queue: Notification[] }
type NotifAction =
  | { type: 'add'; notif: Notification }
  | { type: 'remove'; key: string }
  | { type: 'expire'; key: string }
  | { type: 'promote' }

function notifReducer(state: NotifState, action: NotifAction): NotifState {
  switch (action.type) {
    case 'promote': {
      if (state.current !== null) return state
      const next = getNext(state.queue)
      if (!next) return state
      return { current: next, queue: state.queue.filter(n => n !== next) }
    }
    case 'expire': {
      if (state.current?.key !== action.key) return state
      return { ...state, current: null }
    }
    case 'remove': {
      const isCurrent = state.current?.key === action.key
      return {
        current: isCurrent ? null : state.current,
        queue: state.queue.filter(n => n.key !== action.key),
      }
    }
    case 'add': {
      const { notif } = action
      if (notif.priority === 'immediate') {
        const newQueue = [
          ...(state.current && state.current.priority !== 'immediate' ? [state.current] : []),
          ...state.queue,
        ].filter(n => n.priority !== 'immediate' && !notif.invalidates?.includes(n.key))
        return { current: notif, queue: newQueue }
      }
      if (notif.fold) {
        if (state.current?.key === notif.key) {
          return { ...state, current: notif.fold(state.current, notif) }
        }
        const qi = state.queue.findIndex(n => n.key === notif.key)
        if (qi !== -1) {
          const newQ = [...state.queue]
          newQ[qi] = notif.fold(newQ[qi]!, notif)
          return { ...state, queue: newQ }
        }
      }
      const alreadyPresent = state.current?.key === notif.key || state.queue.some(n => n.key === notif.key)
      if (alreadyPresent) return state
      const invalidatesCurrent = state.current !== null && (notif.invalidates?.includes(state.current.key) ?? false)
      return {
        current: invalidatesCurrent ? null : state.current,
        queue: [
          ...state.queue.filter(n => n.priority !== 'immediate' && !notif.invalidates?.includes(n.key)),
          notif,
        ],
      }
    }
  }
}

type ContextValue = {
  state: NotifState
  dispatch: React.Dispatch<NotifAction>
}
const NotificationsContext = createContext<ContextValue | null>(null)

export function NotificationsProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(notifReducer, { current: null, queue: [] })
  return React.createElement(NotificationsContext.Provider, { value: { state, dispatch } }, children)
}

export function useNotifications(): {
  addNotification: (notif: Notification) => void
  removeNotification: (key: string) => void
} {
  const ctx = useContext(NotificationsContext)!
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { state, dispatch } = ctx

  const scheduleExpire = useCallback((notif: Notification) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      dispatch({ type: 'expire', key: notif.key })
      dispatch({ type: 'promote' })
    }, notif.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  }, [dispatch])

  useEffect(() => {
    if (state.current) {
      scheduleExpire(state.current)
    } else if (state.queue.length > 0) {
      dispatch({ type: 'promote' })
    }
  }, [state.current, state.queue.length, scheduleExpire, dispatch])

  const addNotification = useCallback((notif: Notification) => {
    dispatch({ type: 'add', notif })
  }, [dispatch])

  const removeNotification = useCallback((key: string) => {
    if (timeoutRef.current && ctx.state.current?.key === key) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    dispatch({ type: 'remove', key })
  }, [dispatch, ctx.state.current?.key])

  return { addNotification, removeNotification }
}
