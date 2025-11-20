// TODO: configurar corretamente a requisição para salvar e carregar temas

'use client'

import { applyThemeVars } from '@/components/theme/applyThemeVars'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { useHook } from '@/hooks/useEmpresas'
import type { ThemeColors, ThemeGeneral } from '@/types/theme'
import {
  DEFAULT_DARK_COLORS,
  DEFAULT_LIGHT_COLORS,
  mergeThemeColors,
} from '@/utils/themeMerge'
import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'

// Chave para armazenar o tema admin no localStorage
const ADMIN_THEME_STORAGE_KEY = 'admin_theme_config'

export function useThemeCustomization() {
  const { tenant, isAdminMode } = useAuthTenant()
  const { update } = useHook()

  const [themeConfig, setThemeConfig] = useState<ThemeGeneral | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const themeAppliedRef = useRef(false)

  const applyTheme = useCallback((data: ThemeGeneral, forceApply = false) => {
    if (typeof document === 'undefined') return
    if (themeAppliedRef.current && !forceApply) return

    try {
      const mode = data.appearance?.themeMode ?? 'light'
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      const isDark = mode === 'dark' || (mode === 'system' && prefersDark)

      const colors = mergeThemeColors(isDark ? data.dark : data.light, isDark)
      if (colors) applyThemeVars(colors as unknown as Record<string, string>)

      if (data.appearance) {
        document.documentElement.style.setProperty(
          '--radius',
          `${data.appearance.borderRadius}px`
        )
        document.documentElement.style.setProperty(
          '--font-family',
          data.appearance.fontFamily
        )
      }

      const root = document.documentElement
      if (isDark) root.classList.add('dark')
      else root.classList.remove('dark')

      themeAppliedRef.current = true
      setThemeConfig(data)
    } catch (error) {
      console.error('❌ Erro ao aplicar tema:', error)
    }
  }, [])

  // 🔹 Salvar tema admin no localStorage
  const saveAdminThemeToStorage = useCallback((theme: ThemeGeneral) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(ADMIN_THEME_STORAGE_KEY, JSON.stringify(theme))
    } catch (error) {
      console.error('❌ Erro ao salvar tema admin no localStorage:', error)
    }
  }, [])

  // 🔹 Carregar tema admin do localStorage
  const loadAdminThemeFromStorage = useCallback((): ThemeGeneral | null => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(ADMIN_THEME_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('❌ Erro ao carregar tema admin do localStorage:', error)
      return null
    }
  }, [])

  // 🔹 Cria tema padrão
  const createDefaultTheme = useCallback(
    (): ThemeGeneral => ({
      appearance: {
        themeMode: 'system',
        borderRadius: 6,
        fontFamily: 'Inter, sans-serif',
      },
      title: isAdminMode ? 'GestorAI 360' : '',
      light: DEFAULT_LIGHT_COLORS as ThemeColors,
      dark: DEFAULT_DARK_COLORS as ThemeColors,
    }),
    [isAdminMode]
  )

  const loadTheme = useCallback(async () => {
    if (typeof window === 'undefined') return

    setLoading(true)

    try {
      let themeToApply: ThemeGeneral

      if (isAdminMode) {
        // Modo Admin: Carrega do localStorage
        const storedTheme = loadAdminThemeFromStorage()
        themeToApply = storedTheme || createDefaultTheme()
      } else if (tenant?.id) {
        // Modo Tenant: Carrega da API
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/empresas/tenant`,
            {
              params: { all_data: false, id: tenant.id },
              timeout: 5000,
            }
          )

          const config = response?.data?.data[0]?.configuracao as ThemeGeneral
          if (config) {
            themeToApply = config
          } else {
            console.log('Nenhum tema encontrado no tenant')
            themeToApply = createDefaultTheme()
          }
        } catch (error) {
          console.error('Erro ao carregar tema do tenant:', error)
          themeToApply = createDefaultTheme()
        }
      } else {
        // Fallback para tema padrão
        themeToApply = createDefaultTheme()
      }

      setThemeConfig(themeToApply)
      applyTheme(themeToApply, true)
    } catch (err) {
      console.error('Erro crítico ao carregar tema:', err)
      const fallbackTheme = createDefaultTheme()
      setThemeConfig(fallbackTheme)
      applyTheme(fallbackTheme, true)
    } finally {
      setLoading(false)
    }
  }, [
    tenant,
    applyTheme,
    isAdminMode,
    createDefaultTheme,
    loadAdminThemeFromStorage,
  ])

  useEffect(() => {
    loadTheme()
  }, [loadTheme])

  useEffect(() => {
    if (themeConfig && !loading) {
      themeAppliedRef.current = false
      loadTheme()
    }
  }, [tenant?.id, isAdminMode])

  const saveTheme = useCallback(
    async (newTheme: ThemeGeneral) => {
      setSaving(true)
      try {
        applyTheme(newTheme, true)

        if (isAdminMode) {
          // Modo Admin: Salva no localStorage
          saveAdminThemeToStorage(newTheme)
        } else if (tenant?.id) {
          // Modo Tenant: Salva na API
          await update(tenant.id, { configuracao: newTheme })
        }

        setThemeConfig(newTheme)
      } catch (error) {
        console.error('❌ Erro ao salvar tema:', error)
        throw error
      } finally {
        setSaving(false)
      }
    },
    [tenant, update, applyTheme, isAdminMode, saveAdminThemeToStorage]
  )

  return {
    themeConfig,
    setThemeConfig,
    saveTheme,
    loadTheme,
    applyTheme,
    loading,
    saving,
  }
}
