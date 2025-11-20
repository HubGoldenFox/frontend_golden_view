// helpers/themeMerge.ts

/**
 * Cores padrão do sistema como fallback
 */
export const DEFAULT_LIGHT_COLORS = {
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(222.2 84% 4.9%)',
  card: 'hsl(0 0% 100%)',
  'card-foreground': 'hsl(222.2 84% 4.9%)',
  popover: 'hsl(0 0% 100%)',
  'popover-foreground': 'hsl(222.2 84% 4.9%)',
  primary: 'hsl(221 83% 53%)',
  'primary-foreground': 'hsl(210 40% 98%)',
  secondary: 'hsl(210 40% 96%)',
  'secondary-foreground': 'hsl(222.2 84% 4.9%)',
  muted: 'hsl(210 40% 96%)',
  'muted-foreground': 'hsl(215.4 16.3% 46.9%)',
  accent: 'hsl(210 40% 96%)',
  'accent-foreground': 'hsl(222.2 84% 4.9%)',
  destructive: 'hsl(0 84% 60%)',
  'destructive-foreground': 'hsl(210 40% 98%)',
  border: 'hsl(214.3 31.8% 91.4%)',
  input: 'hsl(214.3 31.8% 91.4%)',
  ring: 'hsl(221.2 83.2% 53.3%)',
  'gradient-from': 'hsl(0 0% 100%)',
  'gradient-to': 'hsl(221 83% 53%)',
}

export const DEFAULT_DARK_COLORS = {
  background: 'hsl(222.2 84% 6%)',
  foreground: 'hsl(210 30% 96%)',
  card: 'hsl(222.2 84% 4.9%)',
  'card-foreground': 'hsl(210 40% 98%)',
  popover: 'hsl(222.2 84% 4.9%)',
  'popover-foreground': 'hsl(210 40% 98%)',
  primary: 'hsl(217 91% 65%)',
  'primary-foreground': 'hsl(222.2 84% 4.9%)',
  secondary: 'hsl(217.2 32.6% 17.5%)',
  'secondary-foreground': 'hsl(210 40% 98%)',
  muted: 'hsl(217.2 32.6% 17.5%)',
  'muted-foreground': 'hsl(215 20% 75%)',
  accent: 'hsl(217.2 32.6% 17.5%)',
  'accent-foreground': 'hsl(210 40% 98%)',
  destructive: 'hsl(0 100% 60%)',
  'destructive-foreground': 'hsl(0 0% 100%)',
  border: 'hsl(217.2 32.6% 17.5%)',
  input: 'hsl(217.2 32.6% 17.5%)',
  ring: 'hsl(217 91% 65%)',
  'gradient-from': 'hsl(217.2 32.6% 17.5%)',
  'gradient-to': 'hsl(222.2 84% 6%)',
}

/**
 * Função para mesclar cores personalizadas com cores padrão
 * Garante que todas as cores necessárias estejam presentes
 */
export function mergeThemeColors(
  customColors: any, // Usamos any para evitar problemas de tipagem
  isDark: boolean
): Record<string, string> {
  const defaultColors = isDark ? DEFAULT_DARK_COLORS : DEFAULT_LIGHT_COLORS

  // Se não há cores personalizadas, retorna apenas as padrão
  if (!customColors || typeof customColors !== 'object') {
    return { ...defaultColors }
  }

  // Mescla as cores, priorizando as personalizadas mas garantindo fallbacks
  const mergedColors: Record<string, string> = { ...defaultColors }

  // Aplica apenas as cores personalizadas que existem
  Object.keys(customColors).forEach((key) => {
    const colorValue = customColors[key]
    if (typeof colorValue === 'string' && colorValue.trim() !== '') {
      mergedColors[key] = colorValue
    }
  })

  return mergedColors
}

/**
 * Valida se um objeto de cores tem todas as propriedades necessárias
 */
export function validateThemeColors(colors: Record<string, string>): boolean {
  const requiredKeys = [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
  ]

  return requiredKeys.every(
    (key) =>
      colors[key] &&
      typeof colors[key] === 'string' &&
      colors[key].trim() !== ''
  )
}
