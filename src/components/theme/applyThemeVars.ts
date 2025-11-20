export function applyThemeVars(
  vars: Record<string, string>,
  mode: 'light' | 'dark' = 'light'
) {
  if (!vars || typeof window === 'undefined') return

  const root =
    mode === 'dark'
      ? (document.querySelector('.dark') as HTMLElement) ||
        document.documentElement
      : document.documentElement

  Object.entries(vars).forEach(([key, value]) => {
    if (!value) return
    // garante que o nome corresponda ao global.css
    const varName = key.startsWith('color-') ? key : `color-${key}`

    root.style.setProperty(`--${varName}`, value)
  })
}
