/**
 * Tipos disponíveis para o tema
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Configuração de aparência
 */
export interface ThemeAppearance {
  themeMode: ThemeMode
  borderRadius: number
  fontFamily: string
}

/**
 * Paleta completa de cores — mantém compatibilidade
 * mas organiza visualmente por categorias
 */
export interface ThemeColors {
  // Base da interface
  background: string
  foreground: string
  card: string
  'card-foreground': string
  popover: string
  'popover-foreground': string
  border: string
  input: string
  ring: string

  // gradiente
  'gradient-from': string
  'gradient-to': string

  // Cores principais
  primary: string
  'primary-foreground': string
  secondary: string
  'secondary-foreground': string
  accent: string
  'accent-foreground': string

  // Feedback / status
  success: string
  'success-foreground': string
  warning: string
  'warning-foreground': string
  error: string
  'error-foreground': string
  destructive: string
  'destructive-foreground': string

  // Neutros / suporte
  muted: string
  'muted-foreground': string
}

export type ThemeGeneral = {
  title?: string
  logoBase64?: string
  faviconBase64?: string

  // Preferências visuais
  appearance: ThemeAppearance

  // Paletas opcionais para claro/escuro
  light?: ThemeColors
  dark?: ThemeColors
}
