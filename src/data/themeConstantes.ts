import { ThemeColors } from '@//types/theme'

export const defaultLightColors: ThemeColors = {
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(222.2 84% 4.9%)',
  primary: 'hsl(221 83% 53%)',
  'primary-foreground': 'hsl(210 40% 98%)',
  secondary: 'hsl(210 40% 96%)',
  'secondary-foreground': 'hsl(222.2 84% 4.9%)',
  accent: 'hsl(210 40% 96%)',
  'accent-foreground': 'hsl(222.2 84% 4.9%)',
  success: 'hsl(142 76% 36%)',
  'success-foreground': 'hsl(0 0% 100%)',
  warning: 'hsl(38 92% 50%)',
  'warning-foreground': 'hsl(20 100% 20%)',
  error: 'hsl(0 84% 60%)',
  'error-foreground': 'hsl(0 0% 98%)',
  destructive: 'hsl(0 84% 60%)',
  'destructive-foreground': 'hsl(0 0% 98%)',
  muted: 'hsl(210 40% 96%)',
  'muted-foreground': 'hsl(215.4 16.3% 46.9%)',
  border: 'hsl(214.3 31.8% 91.4%)',
  input: 'hsl(214.3 31.8% 91.4%)',
  ring: 'hsl(221.2 83.2% 53.3%)',
  card: 'hsl(0 0% 100%)',
  'card-foreground': 'hsl(222.2 84% 4.9%)',
  popover: 'hsl(0 0% 100%)',
  'popover-foreground': 'hsl(222.2 84% 4.9%)',
  'gradient-from': 'hsl(0 0% 100%)',
  'gradient-to': 'hsl(219 100% 97%)',
}

export const defaultDarkColors: ThemeColors = {
  background: 'hsl(222.2 84% 6%)',
  foreground: 'hsl(210 30% 96%)',
  primary: 'hsl(217 91% 65%)',
  'primary-foreground': 'hsl(222.2 84% 4.9%)',
  secondary: 'hsl(217.2 32.6% 17.5%)',
  'secondary-foreground': 'hsl(210 40% 98%)',
  accent: 'hsl(217.2 32.6% 17.5%)',
  'accent-foreground': 'hsl(210 40% 98%)',
  success: 'hsl(142 76% 50%)',
  'success-foreground': 'hsl(0 0% 100%)',
  warning: 'hsl(38 92% 45%)',
  'warning-foreground': 'hsl(48 100% 96%)',
  error: 'hsl(0 100% 60%)',
  'error-foreground': 'hsl(0 0% 100%)',
  destructive: 'hsl(0 100% 60%)',
  'destructive-foreground': 'hsl(0 0% 100%)',
  muted: 'hsl(217.2 32.6% 17.5%)',
  'muted-foreground': 'hsl(215 20% 75%)',
  border: 'hsl(217.2 32.6% 17.5%)',
  input: 'hsl(217.2 32.6% 17.5%)',
  ring: 'hsl(217 91% 65%)',
  card: 'hsl(222.2 84% 4.9%)',
  'card-foreground': 'hsl(210 40% 98%)',
  popover: 'hsl(222.2 84% 4.9%)',
  'popover-foreground': 'hsl(210 40% 98%)',
  'gradient-from': 'hsl(217.2 32.6% 17.5%)',
  'gradient-to': 'hsl(222.2 84% 6%)',
}

// constants/colorCategories.ts
export const COLOR_CATEGORIES = [
  {
    id: 'primary',
    title: 'Cores Principais',
    description: 'Cores principais para ações e elementos chave',
    fields: [
      {
        key: 'primary',
        label: 'Cor Primária',
        description: 'Cor principal para botões e ações',
      },
      {
        key: 'primary-foreground',
        label: 'Texto Primário',
        description: 'Texto sobre cor primária',
      },
      {
        key: 'secondary',
        label: 'Cor Secundária',
        description: 'Cor para ações secundárias',
      },
      {
        key: 'secondary-foreground',
        label: 'Texto Secundário',
        description: 'Texto sobre cor secundária',
      },
    ],
  },
  {
    id: 'background',
    title: 'Fundos',
    description: 'Cores de fundo da aplicação',
    fields: [
      {
        key: 'background',
        label: 'Fundo Principal',
        description: 'Cor de fundo da aplicação',
      },
      {
        key: 'foreground',
        label: 'Texto Principal',
        description: 'Cor do texto principal',
      },
      {
        key: 'card',
        label: 'Fundo do Card',
        description: 'Cor de fundo dos cards',
      },
      {
        key: 'card-foreground',
        label: 'Texto do Card',
        description: 'Texto sobre fundo de card',
      },
      {
        key: 'gradient-from',
        label: 'Início do gradiente',
        description: 'Cor de Início do gradiente',
      },
      {
        key: 'gradient-to',
        label: 'Fim do gradiente',
        description: 'Cor de Fim do gradiente',
      },
    ],
  },
  {
    id: 'ui',
    title: 'Interface',
    description: 'Cores para elementos de interface',
    fields: [
      {
        key: 'muted',
        label: 'Atenuado',
        description: 'Cor para elementos atenuados',
      },
      {
        key: 'muted-foreground',
        label: 'Texto Atenuado',
        description: 'Texto sobre fundo atenuado',
      },
      {
        key: 'accent',
        label: 'Destaque',
        description: 'Cor para elementos em destaque',
      },
      {
        key: 'accent-foreground',
        label: 'Texto de Destaque',
        description: 'Texto sobre fundo de destaque',
      },
    ],
  },
  {
    id: 'forms',
    title: 'Formulários',
    description: 'Cores para elementos de formulário',
    fields: [
      {
        key: 'input',
        label: 'Campo de Entrada',
        description: 'Fundo dos campos de entrada',
      },
      { key: 'border', label: 'Borda', description: 'Cor das bordas' },
      {
        key: 'ring',
        label: 'Anel de Foco',
        description: 'Cor do anel em estado de foco',
      },
    ],
  },
]
