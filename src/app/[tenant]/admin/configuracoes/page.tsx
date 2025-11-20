'use client'

import { Button } from '@/components/custom/Button'
import ColorPicker from '@/components/theme/ColorPicker'
import { useToast } from '@/contexts/ToastContext'
import {
  COLOR_CATEGORIES,
  defaultDarkColors,
  defaultLightColors,
} from '@/data/themeConstantes'
import { useThemeCustomization } from '@/hooks/useThemeCustomization'
import {
  ThemeAppearance,
  ThemeColors,
  ThemeGeneral,
  ThemeMode,
} from '@/types/theme'
import { useEffect, useRef, useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('general')
  const [localTheme, setLocalTheme] = useState<ThemeGeneral | null>(null)
  const [colorThemeMode, setColorThemeMode] = useState<'light' | 'dark'>(
    'light'
  )
  const [activeColorCategory, setActiveColorCategory] =
    useState<string>('primary')
  const [activePreviewComponent, setActivePreviewComponent] =
    useState<string>('dashboard')

  // Adicione no início do componente, com os outros estados
  const [hasGeneralChanges, setHasGeneralChanges] = useState(false)
  const [showReloginAlert, setShowReloginAlert] = useState(false)

  const { themeConfig, saveTheme, loading } = useThemeCustomization()

  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (themeConfig) {
      setLocalTheme(themeConfig)
    }
  }, [themeConfig])

  useEffect(() => {
    if (!themeConfig) return

    const hasChanges =
      localTheme?.title !== themeConfig.title ||
      localTheme?.logoBase64 !== themeConfig.logoBase64 ||
      localTheme?.faviconBase64 !== themeConfig.faviconBase64

    setHasGeneralChanges(hasChanges)
  }, [localTheme, themeConfig])

  if (loading || !localTheme) {
    return <div className="p-6 text-gray-500">Carregando tema...</div>
  }

  // Helper para obter valores seguros com fallback
  const getSafeValue = <T,>(value: T | undefined, defaultValue: T): T => {
    return value ?? defaultValue
  }

  // Helper para obter cores atuais com fallback
  const getCurrentColors = (): ThemeColors => {
    const colors = localTheme[colorThemeMode]
    if (!colors) {
      return colorThemeMode === 'light' ? defaultLightColors : defaultDarkColors
    }

    // Mescla com cores padrão para garantir que todas as propriedades existam
    return {
      ...(colorThemeMode === 'light' ? defaultLightColors : defaultDarkColors),
      ...colors,
    }
  }

  // Helper para obter aparência com fallback
  const getAppearance = (): ThemeAppearance => {
    const defaultAppearance: ThemeAppearance = {
      themeMode: 'system',
      borderRadius: 8,
      fontFamily: "'Inter', sans-serif",
    }

    return {
      ...defaultAppearance,
      ...localTheme.appearance,
    }
  }

  const handleSaveSettings = async () => {
    if (hasGeneralChanges && activeTab === 'general') {
      setShowReloginAlert(true)
    } else {
      await saveTheme(localTheme)
      toast.success('Tema atualizado com sucesso')
    }
  }
  const handleGeneralChange = (
    field: keyof Omit<ThemeGeneral, 'appearance' | 'light' | 'dark'>,
    value: string | undefined
  ) => {
    setLocalTheme((prev) => ({
      ...prev!,
      [field]: value,
    }))
  }

  const handleLogoClick = () => {
    logoInputRef.current?.click()
  }

  const handleFaviconClick = () => {
    faviconInputRef.current?.click()
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        handleGeneralChange('logoBase64', base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        handleGeneralChange('faviconBase64', base64)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handlers para a aba Aparência
  const handleAppearanceChange = (
    field: keyof ThemeAppearance,
    value: string | number
  ) => {
    setLocalTheme((prev) => ({
      ...prev!,
      appearance: {
        ...getAppearance(),
        [field]: value,
      },
    }))
  }

  // Handlers para a aba Cores
  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    setLocalTheme((prev) => {
      const currentTheme = prev!
      const currentColors = currentTheme[colorThemeMode] || {}

      return {
        ...currentTheme,
        [colorThemeMode]: {
          ...currentColors,
          [colorKey]: value,
        },
      }
    })
  }

  const handleResetColors = (mode: 'light' | 'dark' | 'all') => {
    if (mode === 'all') {
      setLocalTheme((prev) => ({
        ...prev!,
        light: defaultLightColors,
        dark: defaultDarkColors,
      }))
    } else {
      setLocalTheme((prev) => ({
        ...prev!,
        [mode]: mode === 'light' ? defaultLightColors : defaultDarkColors,
      }))
    }
  }

  // Obter valores atuais com fallback
  const currentColors = getCurrentColors()
  const currentAppearance = getAppearance()
  const currentCategory = COLOR_CATEGORIES.find(
    (cat) => cat.id === activeColorCategory
  )

  const ReloginAlert = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 bg-warning text-warning-foreground rounded flex items-center justify-center">
            ⚠️
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Confirmação de Alterações
          </h3>
        </div>

        <p className="text-muted-foreground mb-6">
          Você alterou configurações sensíveis (título, logo ou favicon). Para
          visualizar as mudanças corretamente, será necessário fazer login
          novamente na aplicação. Caso não funcione aguarde alguns minutos e
          tente novamente.
        </p>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setShowReloginAlert(false)}
            className="px-4 py-2"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              saveTheme(localTheme)
              setShowReloginAlert(false)
            }}
            className="px-4 py-2 bg-warning text-warning-foreground hover:bg-warning/90"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )

  // Componente de Preview para a aba Cores
  const renderColorPreview = () => (
    <div className="space-y-4">
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: currentColors.background,
          borderColor: currentColors.border,
          borderRadius: `${currentAppearance.borderRadius}px`,
        }}
      >
        {/* Header Preview */}
        <div
          className="flex items-center justify-between mb-4 pb-3 border-b"
          style={{ borderColor: currentColors.border }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded"
              style={{ backgroundColor: currentColors.primary }}
            ></div>
            <span
              className="font-medium text-sm"
              style={{ color: currentColors.foreground }}
            >
              {getSafeValue(localTheme.title, 'App')}
            </span>
          </div>
          <div
            className="w-6 h-6 rounded"
            style={{ backgroundColor: currentColors.muted }}
          ></div>
        </div>

        {/* Card Preview */}
        <div
          className="p-3 rounded-lg mb-3"
          style={{
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
            borderRadius: `${currentAppearance.borderRadius * 0.75}px`,
          }}
        >
          <h4
            className="font-semibold text-sm mb-2"
            style={{ color: currentColors['card-foreground'] }}
          >
            Card Example
          </h4>
          <p
            className="text-xs mb-3"
            style={{ color: currentColors['muted-foreground'] }}
          >
            This is a sample card with content
          </p>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                backgroundColor: currentColors.primary,
                color: currentColors['primary-foreground'],
                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
              }}
            >
              Primary
            </button>
            <button
              className="px-2 py-1 rounded text-xs font-medium border"
              style={{
                borderColor: currentColors.border,
                color: currentColors.foreground,
                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
              }}
            >
              Secondary
            </button>
          </div>
        </div>

        {/* Status Preview */}
        <div className="space-y-2">
          <div
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: currentColors.success,
              color: currentColors['success-foreground'],
              borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
            }}
          >
            ✓ Success
          </div>
          <div
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: currentColors.warning,
              color: currentColors['warning-foreground'],
              borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
            }}
          >
            ⚠️ Warning
          </div>
          <div
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: currentColors.error,
              color: currentColors['error-foreground'],
              borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
            }}
          >
            ✕ Error
          </div>
        </div>
      </div>

      {/* Color Info */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <h4 className="font-medium mb-3 text-sm">Theme Info</h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Mode:</span>
            <span className="font-medium capitalize">{colorThemeMode}</span>
          </div>
          <div className="flex justify-between">
            <span>Border Radius:</span>
            <span className="font-medium">
              {currentAppearance.borderRadius}px
            </span>
          </div>
          <div className="flex justify-between">
            <span>Custom Colors:</span>
            <span className="font-medium">
              {
                Object.keys(currentColors).filter(
                  (key) =>
                    currentColors[key as keyof ThemeColors] !==
                    (colorThemeMode === 'light'
                      ? defaultLightColors
                      : defaultDarkColors)[key as keyof ThemeColors]
                ).length
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  // Componente de Preview para a aba Preview
  const renderComponentPreview = () => {
    const componentProps = {
      colors: currentColors,
      borderRadius: currentAppearance.borderRadius,
      title: getSafeValue(localTheme.title, 'App Name'),
    }

    switch (activePreviewComponent) {
      case 'dashboard':
        return <DashboardPreview {...componentProps} />
      case 'cards':
        return <CardsPreview {...componentProps} />
      case 'forms':
        return <FormsPreview {...componentProps} />
      case 'navigation':
        return <NavigationPreview {...componentProps} />
      default:
        return <DashboardPreview {...componentProps} />
    }
  }

  // Componentes de Preview
  const DashboardPreview = ({ colors, borderRadius, title }: any) => (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex justify-between items-center pb-4 border-b"
        style={{ borderColor: colors.border }}
      >
        <h1 className="text-2xl font-bold" style={{ color: colors.foreground }}>
          {title}
        </h1>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: colors.primary }}
          ></div>
          <span style={{ color: colors.foreground }}>User</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: `${borderRadius}px`,
            }}
          >
            <h3
              className="font-semibold mb-2"
              style={{ color: colors['card-foreground'] }}
            >
              Statistic {item}
            </h3>
            <p
              className="text-2xl font-bold mb-2"
              style={{ color: colors.primary }}
            >
              {item * 123}
            </p>
            <p
              className="text-sm"
              style={{ color: colors['muted-foreground'] }}
            >
              +{item * 12}% from last month
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: `${borderRadius}px`,
        }}
      >
        <h3
          className="font-semibold mb-4"
          style={{ color: colors['card-foreground'] }}
        >
          Recent Activity
        </h3>
        <div className="space-y-3">
          {['User login', 'Data updated', 'Report generated'].map(
            (activity, index) => (
              <div key={index} className="flex items-center gap-3 py-2">
                <div
                  className="w-2 h-2 rounded"
                  style={{ backgroundColor: colors.primary }}
                ></div>
                <span style={{ color: colors.foreground }} className="text-sm">
                  {activity}
                </span>
                <span
                  style={{ color: colors['muted-foreground'] }}
                  className="text-xs ml-auto"
                >
                  2h ago
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )

  const CardsPreview = ({ colors, borderRadius }: any) => (
    <div className="space-y-6">
      <h3
        className="text-xl font-semibold"
        style={{ color: colors.foreground }}
      >
        Card Variants
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Card */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: `${borderRadius}px`,
          }}
        >
          <h4
            className="font-semibold mb-2"
            style={{ color: colors['card-foreground'] }}
          >
            Primary Card
          </h4>
          <p
            className="text-sm mb-4"
            style={{ color: colors['muted-foreground'] }}
          >
            This is a primary card with important content.
          </p>
          <button
            className="px-3 py-1 rounded text-sm font-medium"
            style={{
              backgroundColor: colors.primary,
              color: colors['primary-foreground'],
              borderRadius: `${borderRadius * 0.75}px`,
            }}
          >
            Action
          </button>
        </div>

        {/* Secondary Card */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: colors.muted,
            borderColor: colors.border,
            borderRadius: `${borderRadius}px`,
          }}
        >
          <h4
            className="font-semibold mb-2"
            style={{ color: colors.foreground }}
          >
            Secondary Card
          </h4>
          <p className="text-sm" style={{ color: colors['muted-foreground'] }}>
            Secondary information with muted background.
          </p>
        </div>
      </div>
    </div>
  )

  const FormsPreview = ({ colors, borderRadius }: any) => (
    <div className="space-y-6">
      <h3
        className="text-xl font-semibold"
        style={{ color: colors.foreground }}
      >
        Form Elements
      </h3>
      <div className="space-y-4 max-w-md">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: colors.foreground }}
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border rounded transition-colors"
            style={{
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.foreground,
              borderRadius: `${borderRadius * 0.5}px`,
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: colors.foreground }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 border rounded transition-colors"
            style={{
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.foreground,
              borderRadius: `${borderRadius * 0.5}px`,
            }}
          />
        </div>

        <button
          className="w-full p-3 rounded font-medium"
          style={{
            backgroundColor: colors.primary,
            color: colors['primary-foreground'],
            borderRadius: `${borderRadius * 0.5}px`,
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  )

  const NavigationPreview = ({ colors, borderRadius }: any) => (
    <div className="space-y-6">
      <h3
        className="text-xl font-semibold"
        style={{ color: colors.foreground }}
      >
        Navigation
      </h3>
      <div className="space-y-2 max-w-xs">
        {['Dashboard', 'Settings', 'Profile', 'Messages', 'Help'].map(
          (item) => (
            <div
              key={item}
              className="px-3 py-2 rounded transition-colors cursor-pointer"
              style={{
                color: colors.foreground,
                borderRadius: `${borderRadius * 0.5}px`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent
                e.currentTarget.style.color = colors['accent-foreground']
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = colors.foreground
              }}
            >
              {item}
            </div>
          )
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background rounded-md py-4 sm:py-6 lg:py-8 mt-6">
      <div className="mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Configurações do Tema
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Personalize completamente a aparência da sua aplicação
            </p>
          </div>
          <Button
            id="save-btn"
            onClick={handleSaveSettings}
            variant="outline"
            className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors duration-200"
          >
            Salvar Configurações
          </Button>
        </div>

        {/* Tabs Principais */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
              {[
                { id: 'general', label: 'Geral', icon: '⚙️' },
                { id: 'appearance', label: 'Fonte', icon: '🎨' },
                { id: 'colors', label: 'Cores', icon: '🎨' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-3 sm:px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-accent-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="space-y-8">
          {/* Aba Geral */}
          {activeTab === 'general' && (
            <div className="space-y-8">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Configurações da Aplicação
                </h2>

                <div className="space-y-8">
                  {/* Título da Aplicação */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-sm font-medium">
                        Título da Aplicação *
                      </label>
                      <input
                        type="text"
                        value={getSafeValue(localTheme.title, '')}
                        onChange={(e) =>
                          handleGeneralChange('title', e.target.value)
                        }
                        className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Nome da sua aplicação"
                        maxLength={60}
                      />
                      <p className="text-sm text-muted-foreground">
                        Aparece na aba do navegador (máx. 60 caracteres)
                      </p>
                    </div>

                    {/* Preview do Título */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium">
                        Preview da Aba
                      </label>
                      <div className="p-6 border border-border rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex gap-1">
                            <div className="w-3 h-3 rounded bg-red-400"></div>
                            <div className="w-3 h-3 rounded bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded bg-green-400"></div>
                          </div>
                          <div className="flex-1 text-center">
                            <span className="text-sm text-foreground/80 font-medium truncate block">
                              {getSafeValue(
                                localTheme.title,
                                'Nome da Aplicação'
                              )}
                            </span>
                          </div>
                          <div className="w-6"></div>
                        </div>
                        <div className="text-center py-8">
                          <p className="text-foreground/60">
                            Conteúdo da sua aplicação...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logo da Aplicação */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <label className="block text-sm font-medium">
                        Logo da Aplicação
                      </label>
                      <div className="space-y-6">
                        {/* Área de Upload da Logo */}
                        <div
                          onClick={handleLogoClick}
                          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                        >
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                              <span className="text-primary text-2xl">📷</span>
                            </div>
                            <div>
                              <p className="text-lg font-medium text-foreground mb-2">
                                Clique para fazer upload
                              </p>
                              <p className="text-sm text-muted-foreground">
                                PNG, JPG ou SVG • Recomendado: 200x60px
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Máx: 2MB • Formato retangular
                              </p>
                            </div>
                          </div>
                          <input
                            ref={logoInputRef}
                            type="file"
                            className="hidden"
                            accept=".png,.jpg,.jpeg,.svg"
                            onChange={handleLogoUpload}
                          />
                        </div>

                        {/* Preview da Logo atual */}
                        {localTheme.logoBase64 && (
                          <div className="space-y-3">
                            <label className="block text-sm font-medium">
                              Logo atual:
                            </label>
                            <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-background">
                              <img
                                src={localTheme.logoBase64}
                                alt="Logo atual"
                                className="h-12 w-auto max-w-32 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                              <button
                                onClick={() =>
                                  handleGeneralChange('logoBase64', undefined)
                                }
                                className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preview da Logo */}
                    <div className="space-y-6">
                      <label className="block text-sm font-medium">
                        Preview da Logo
                      </label>
                      <div className="space-y-6">
                        {/* Preview no Header */}
                        <div className="p-6 border border-border rounded-lg bg-muted/30">
                          <h4 className="text-lg font-medium mb-4 text-foreground/80">
                            Header
                          </h4>
                          <div className="flex items-center gap-4 p-4 bg-background rounded border">
                            {localTheme.logoBase64 ? (
                              <img
                                src={localTheme.logoBase64}
                                alt="Logo preview"
                                className="h-10 w-auto max-w-40 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="h-10 w-32 bg-muted rounded flex items-center justify-center">
                                <span className="text-sm text-muted-foreground">
                                  LOGO
                                </span>
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="h-3 bg-muted rounded w-3/4"></div>
                            </div>
                          </div>
                        </div>

                        {/* Preview no Login */}
                        <div className="p-6 border border-border rounded-lg bg-muted/30">
                          <h4 className="text-lg font-medium mb-4 text-foreground/80">
                            Tela de Login
                          </h4>
                          <div className="flex flex-col items-center gap-4 p-6 bg-background rounded border">
                            {localTheme.logoBase64 ? (
                              <img
                                src={localTheme.logoBase64}
                                alt="Logo preview"
                                className="h-16 w-auto max-w-48 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="h-16 w-40 bg-muted rounded flex items-center justify-center">
                                <span className="text-lg text-muted-foreground">
                                  SUA LOGO
                                </span>
                              </div>
                            )}
                            <div className="w-full space-y-3">
                              <div className="h-3 bg-muted rounded w-full"></div>
                              <div className="h-3 bg-muted rounded w-2/3"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Favicon */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <label className="block text-sm font-medium">
                        Favicon
                      </label>
                      <div className="space-y-6">
                        {/* Área de Upload do Favicon */}
                        <div
                          onClick={handleFaviconClick}
                          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                        >
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center">
                              <span className="text-primary text-xl">🎯</span>
                            </div>
                            <div>
                              <p className="text-lg font-medium text-foreground mb-2">
                                Clique para fazer upload
                              </p>
                              <p className="text-sm text-muted-foreground">
                                PNG, ICO ou SVG • Recomendado: 32x32px
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Máx: 1MB • Formato quadrado
                              </p>
                            </div>
                          </div>
                          <input
                            ref={faviconInputRef}
                            type="file"
                            className="hidden"
                            accept=".png,.ico,.jpg,.jpeg,.svg"
                            onChange={handleFaviconUpload}
                          />
                        </div>

                        {/* Preview do Favicon atual */}
                        {localTheme.faviconBase64 && (
                          <div className="space-y-3">
                            <label className="block text-sm font-medium">
                              Favicon atual:
                            </label>
                            <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-background">
                              <img
                                src={localTheme.faviconBase64}
                                alt="Favicon atual"
                                className="h-8 w-8 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                              <button
                                onClick={() =>
                                  handleGeneralChange('faviconBase64', '')
                                }
                                className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preview do Favicon */}
                    <div className="space-y-6">
                      <label className="block text-sm font-medium">
                        Preview do Favicon
                      </label>
                      <div className="p-6 border border-border rounded-lg bg-muted/30">
                        <div className="flex items-center gap-8">
                          {/* Preview na Aba */}
                          <div className="flex-1 space-y-3">
                            <h4 className="text-lg font-medium text-foreground/80">
                              Aba do Navegador
                            </h4>
                            <div className="flex items-center gap-3 p-3 bg-background rounded border">
                              {localTheme.faviconBase64 ? (
                                <img
                                  src={localTheme.faviconBase64}
                                  alt="Favicon"
                                  className="w-6 h-6 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <div className="w-6 h-6 bg-muted rounded"></div>
                              )}
                              <span className="text-sm text-foreground truncate flex-1">
                                {getSafeValue(
                                  localTheme.title,
                                  'Sua Aplicação'
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Ícones de Diferentes Tamanhos */}
                          <div className="space-y-3">
                            <h4 className="text-lg font-medium text-foreground/80">
                              Tamanhos
                            </h4>
                            <div className="flex gap-4">
                              {[16, 32, 48].map((size) => (
                                <div key={size} className="text-center">
                                  <div className="w-12 h-12 border border-border rounded bg-background flex items-center justify-center mb-2">
                                    {localTheme.faviconBase64 ? (
                                      <img
                                        src={localTheme.faviconBase64}
                                        alt={`Favicon ${size}x${size}`}
                                        className="w-6 h-6 object-contain"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none'
                                        }}
                                      />
                                    ) : (
                                      <div
                                        className="bg-muted rounded"
                                        style={{
                                          width: size / 8,
                                          height: size / 8,
                                        }}
                                      ></div>
                                    )}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {size}x{size}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba Aparência */}
          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Configurações de tema e Fonte
                </h2>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Configurações */}
                  <div className="xl:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-sm font-medium">
                          Modo de Tema Padrão
                        </label>
                        <select
                          value={currentAppearance.themeMode}
                          onChange={(e) =>
                            handleAppearanceChange(
                              'themeMode',
                              e.target.value as ThemeMode
                            )
                          }
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        >
                          <option value="system">Seguir sistema</option>
                          <option value="light">Tema Claro</option>
                          <option value="dark">Tema Escuro</option>
                        </select>
                        <p className="text-sm text-muted-foreground">
                          Define o tema padrão da aplicação
                        </p>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-sm font-medium">
                          Família de Fonte
                        </label>
                        <select
                          value={currentAppearance.fontFamily}
                          onChange={(e) =>
                            handleAppearanceChange('fontFamily', e.target.value)
                          }
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        >
                          <option value="'Inter', sans-serif">
                            Inter (Modern)
                          </option>
                          <option value="'Geist Sans', sans-serif">
                            Geist Sans (Futurista)
                          </option>
                          <option value="'Roboto', sans-serif">
                            Roboto (Google)
                          </option>
                          <option value="system-ui, sans-serif">
                            System Native
                          </option>
                        </select>
                        <p className="text-sm text-muted-foreground">
                          Fonte principal da aplicação
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preview Lateral */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-medium">
                        Preview da Aparência
                      </label>

                      <div
                        className="p-4 rounded-lg border"
                        style={{
                          backgroundColor: currentColors.background,
                          borderColor: currentColors.border,
                          borderRadius: `${currentAppearance.borderRadius}px`,
                          fontFamily: currentAppearance.fontFamily,
                        }}
                      >
                        {/* Header Preview */}
                        <div
                          className="flex items-center justify-between mb-4 pb-3 border-b"
                          style={{ borderColor: currentColors.border }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded"
                              style={{
                                backgroundColor: currentColors.primary,
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                              }}
                            ></div>
                            <span
                              className="font-medium text-sm"
                              style={{ color: currentColors.foreground }}
                            >
                              App Header
                            </span>
                          </div>
                          <div
                            className="w-6 h-6 rounded"
                            style={{
                              backgroundColor: currentColors.muted,
                              borderRadius: `${currentAppearance.borderRadius}px`,
                            }}
                          ></div>
                        </div>

                        {/* Cards Preview */}
                        <div className="space-y-3">
                          <div
                            className="p-3 rounded-lg"
                            style={{
                              backgroundColor: currentColors.card,
                              borderColor: currentColors.border,
                              borderRadius: `${currentAppearance.borderRadius}px`,
                            }}
                          >
                            <h4
                              className="font-semibold text-sm mb-2"
                              style={{
                                color: currentColors['card-foreground'],
                              }}
                            >
                              Card Example
                            </h4>
                            <p
                              className="text-xs mb-3"
                              style={{
                                color: currentColors['muted-foreground'],
                              }}
                            >
                              Border radius: {currentAppearance.borderRadius}px
                            </p>
                            <div className="flex gap-2">
                              <button
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: currentColors.primary,
                                  color: currentColors['primary-foreground'],
                                  borderRadius: `${currentAppearance.borderRadius * 0.75}px`,
                                }}
                              >
                                Primary
                              </button>
                              <button
                                className="px-2 py-1 rounded text-xs font-medium border"
                                style={{
                                  borderColor: currentColors.border,
                                  color: currentColors.foreground,
                                  borderRadius: `${currentAppearance.borderRadius * 0.75}px`,
                                }}
                              >
                                Secondary
                              </button>
                            </div>
                          </div>

                          {/* Input Preview */}
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Input field..."
                              className="w-full p-2 border rounded text-xs transition-colors focus:outline-none"
                              style={{
                                backgroundColor: currentColors.input,
                                borderColor: currentColors.border,
                                color: currentColors.foreground,
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                                fontFamily: currentAppearance.fontFamily,
                              }}
                            />
                          </div>

                          {/* Status Badges */}
                          <div className="flex gap-2 flex-wrap">
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: currentColors.success,
                                color: currentColors['success-foreground'],
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                              }}
                            >
                              Success
                            </span>
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: currentColors.warning,
                                color: currentColors['warning-foreground'],
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                              }}
                            >
                              Warning
                            </span>
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: currentColors.error,
                                color: currentColors['error-foreground'],
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                              }}
                            >
                              Error
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba Cores */}
          {activeTab === 'colors' && (
            <div className="space-y-8">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Personalização de Cores -{' '}
                  {colorThemeMode === 'light' ? 'Tema Claro' : 'Tema Escuro'}
                </h2>

                {/* Seletor de Tema */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {(['light', 'dark'] as const).map((themeMode) => (
                    <button
                      key={themeMode}
                      onClick={() => setColorThemeMode(themeMode)}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                        colorThemeMode === themeMode
                          ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                          : 'bg-background text-foreground border-border hover:bg-accent hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>{themeMode === 'light' ? '☀️' : '🌙'}</span>
                        <span className="capitalize">{themeMode}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Configuração de Cores */}
                  <div className="xl:col-span-2 space-y-6">
                    {/* Navegação por Categorias */}
                    <div>
                      <div className="border-b border-border">
                        <nav className="-mb-px flex space-x-4 overflow-x-auto">
                          {COLOR_CATEGORIES.map((category) => (
                            <button
                              key={category.id}
                              onClick={() =>
                                setActiveColorCategory(category.id)
                              }
                              className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                                activeColorCategory === category.id
                                  ? 'text-accent-foreground'
                                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                              }`}
                            >
                              {category.title}
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>

                    {/* Grid de Cores */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          {currentCategory?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {currentCategory?.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentCategory?.fields.map((field) => (
                          <ColorPicker
                            key={`${colorThemeMode}-${field.key}`}
                            label={field.label}
                            description={field.description}
                            value={
                              currentColors[field.key as keyof ThemeColors]
                            }
                            onChange={(value) =>
                              handleColorChange(
                                field.key as keyof ThemeColors,
                                value
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Botões de Reset */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      <Button
                        onClick={() => handleResetColors('light')}
                        variant="outline"
                        className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors duration-200"
                      >
                        Resetar Tema Claro
                      </Button>
                      <Button
                        onClick={() => handleResetColors('dark')}
                        variant="outline"
                        className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors duration-200"
                      >
                        Resetar Tema Escuro
                      </Button>
                      <Button
                        id="save-btn"
                        onClick={handleSaveSettings}
                        variant="outline"
                        className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors duration-200"
                      >
                        Salvar Configurações
                      </Button>
                    </div>
                  </div>

                  {/* Preview Lateral */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div
                        className="p-4 rounded-lg border"
                        style={{
                          backgroundColor: currentColors.background,
                          borderColor: currentColors.border,
                          borderRadius: `${currentAppearance.borderRadius}px`,
                        }}
                      >
                        {/* Header Preview */}
                        <div
                          className="flex items-center justify-between mb-4 pb-3 border-b"
                          style={{ borderColor: currentColors.border }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded"
                              style={{ backgroundColor: currentColors.primary }}
                            ></div>
                            <span
                              className="font-medium text-sm"
                              style={{ color: currentColors.foreground }}
                            >
                              {getSafeValue(localTheme.title, 'App')}
                            </span>
                          </div>
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: currentColors.muted }}
                          ></div>
                        </div>

                        {/* Card Preview */}
                        <div
                          className="p-3 rounded-lg mb-3"
                          style={{
                            backgroundColor: currentColors.card,
                            borderColor: currentColors.border,
                            borderRadius: `${currentAppearance.borderRadius * 0.75}px`,
                          }}
                        >
                          <h4
                            className="font-semibold text-sm mb-2"
                            style={{ color: currentColors['card-foreground'] }}
                          >
                            Card Example
                          </h4>
                          <p
                            className="text-xs mb-3"
                            style={{ color: currentColors['muted-foreground'] }}
                          >
                            This is a sample card with content
                          </p>
                          <div className="flex gap-2">
                            <button
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: currentColors.primary,
                                color: currentColors['primary-foreground'],
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                              }}
                            >
                              Primary
                            </button>
                            <button
                              className="px-2 py-1 rounded text-xs font-medium border"
                              style={{
                                borderColor: currentColors.border,
                                color: currentColors.foreground,
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                              }}
                            >
                              Secondary
                            </button>
                          </div>
                        </div>

                        {/* Status Preview */}
                        <div className="space-y-3">
                          {/* Estados do Sistema */}
                          <div className="space-y-1">
                            <div
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: currentColors.success,
                                color: currentColors['success-foreground'],
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                              }}
                            >
                              ✓ Success
                            </div>
                            <div
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: currentColors.warning,
                                color: currentColors['warning-foreground'],
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                              }}
                            >
                              ⚠️ Warning
                            </div>
                            <div
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: currentColors.error,
                                color: currentColors['error-foreground'],
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                              }}
                            >
                              ✕ Error
                            </div>
                          </div>

                          {/* Preview de Input */}
                          <div className="space-y-2 pt-1">
                            <div className="text-xs text-muted-foreground">
                              Input fields:
                            </div>
                            <input
                              type="text"
                              placeholder="Normal state..."
                              className="w-full p-2 border rounded text-xs transition-colors focus:outline-none"
                              style={{
                                backgroundColor: currentColors.input,
                                borderColor: currentColors.border,
                                color: currentColors.foreground,
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                              }}
                            />
                            <input
                              type="text"
                              placeholder="Focused state..."
                              className="w-full p-2 border rounded text-xs transition-colors"
                              style={{
                                backgroundColor: currentColors.input,
                                borderColor: currentColors.ring,
                                color: currentColors.foreground,
                                borderRadius: `${currentAppearance.borderRadius * 0.5}px`,
                                boxShadow: `0 0 0 1px ${currentColors.ring}30`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showReloginAlert && <ReloginAlert />}
        </div>
      </div>
    </div>
  )
}
