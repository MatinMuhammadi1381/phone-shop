// Shared phone metadata used across pages (kept here to avoid duplicate
// definitions with subtly different shapes in each page).

export type Condition = 'like_new' | 'good' | 'fair'

export const CONDITION_LABELS: Record<Condition, string> = {
  like_new: 'مثل نو',
  good: 'خوب',
  fair: 'قابل قبول',
}

// Per-condition display styles. `bg` values use the dark theme tint used on
// the home grid; callers that need a different tint can derive one from `color`.
export const CONDITION_STYLES: Record<
  Condition,
  { label: string; color: string; bg: string }
> = {
  like_new: { label: 'مثل نو', color: '#22c55e', bg: '#1e3a2f' },
  good: { label: 'خوب', color: '#60a5fa', bg: '#1e2a3a' },
  fair: { label: 'قابل قبول', color: '#f59e0b', bg: '#3a2a1e' },
}

export const CONDITION_STYLES_DETAIL: Record<
  Condition,
  { label: string; color: string }
> = {
  like_new: { label: 'مثل نو', color: '#6fe3a8' },
  good: { label: 'خوب', color: '#60a5fa' },
  fair: { label: 'قابل قبول', color: '#fbbf24' },
}

export function conditionLabel(condition: string): string {
  return (
    CONDITION_LABELS[condition as Condition] ?? condition
  )
}

export function conditionStyle(condition: string) {
  return CONDITION_STYLES[condition as Condition] ?? CONDITION_STYLES.fair
}

export function conditionStyleDetail(condition: string) {
  return (
    CONDITION_STYLES_DETAIL[condition as Condition] ?? CONDITION_STYLES_DETAIL.fair
  )
}

// Condition + badge info for a phone, honoring the `new_box` section override.
export function phoneCondition(phone: {
  condition: string
  section?: string | null
}): { label: string; color: string } {
  if (phone.section === 'new_box') {
    return { label: 'اکبند', color: '#ef4444' }
  }
  return conditionStyleDetail(phone.condition)
}
