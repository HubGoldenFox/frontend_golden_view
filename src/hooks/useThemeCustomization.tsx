'use client'

import { applyThemeVars } from '@/components/theme/applyThemeVars'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { useHook } from '@/hooks/useTenants'
import type { ThemeColors, ThemeGeneral } from '@/types/theme'
import {
  DEFAULT_DARK_COLORS,
  DEFAULT_LIGHT_COLORS,
  mergeThemeColors,
} from '@/utils/themeMerge'
import { default as api, default as axios } from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useThemeCustomization() {
  const { tenant, isAdminMode, auth } = useAuthTenant()
  const { update } = useHook()

  const [themeConfig, setThemeConfig] = useState<ThemeGeneral | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const themeAppliedRef = useRef(false)

  const applyTheme = useCallback((data: ThemeGeneral, forceApply = false) => {
    if (typeof document === 'undefined') return
    if (themeAppliedRef.current && !forceApply) return

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
  }, [])

  // 🔹 Cria tema padrão
  const createDefaultTheme = useCallback(
    (): ThemeGeneral => ({
      appearance: {
        themeMode: 'light',
        borderRadius: 6,
        fontFamily: 'Inter, sans-serif',
      },
      title: isAdminMode ? 'Golden View' : '',
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

      if (tenant?.id) {
        // Tanto admin quanto usuário normal carregam do tenant
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/tenants`,
            {
              params: { all_data: false, id: tenant.id },
              timeout: 5000,
            }
          )

          const config = response?.data?.data[0]?.configuracao as ThemeGeneral
          if (config) {
            themeToApply = config
          } else {
            themeToApply = createDefaultTheme()
          }
        } catch (error) {
          themeToApply = createDefaultTheme()
        }
      } else {
        // Fallback para tema padrão
        themeToApply = createDefaultTheme()
      }

      setThemeConfig(themeToApply)
      applyTheme(themeToApply, true)
    } catch (err) {
      const fallbackTheme = createDefaultTheme()
      setThemeConfig(fallbackTheme)
      applyTheme(fallbackTheme, true)
    } finally {
      setLoading(false)
    }
  }, [tenant, applyTheme, createDefaultTheme])

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

        if (tenant?.id && !isAdminMode) {
          // Tanto admin quanto usuário normal salvam no tenant
          await update(tenant.id, { configuracao: newTheme })
        } else if (tenant?.id) {
          console.log({ configuracao: newTheme })
          await api.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenant.id}`,
            {
              configuracao: newTheme,
            },
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          )
        }

        setThemeConfig(newTheme)
      } catch (error) {
        console.log(error)
        throw error
      } finally {
        setSaving(false)
      }
    },
    [tenant, update, applyTheme]
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
