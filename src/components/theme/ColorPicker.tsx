'use client'

import { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerProps {
  label: string
  description: string
  value: string
  onChange: (color: string) => void
}

// Função para converter HEX para HSL
function hexToHsl(hex: string): string {
  // Remove o # se existir
  hex = hex.replace(/^#/, '')

  // Parse para RGB
  let r, g, b
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16) / 255
    g = parseInt(hex[1] + hex[1], 16) / 255
    b = parseInt(hex[2] + hex[2], 16) / 255
  } else {
    r = parseInt(hex.slice(0, 2), 16) / 255
    g = parseInt(hex.slice(2, 4), 16) / 255
    b = parseInt(hex.slice(4, 6), 16) / 255
  }

  // Converter RGB para HSL
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  // Converter para valores usuais
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `hsl(${h} ${s}% ${l}%)`
}

// Função para HSL para HEX (para mostrar no picker)
function hslToHex(hsl: string): string {
  // Parse HSL string
  const match = hsl.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/)
  if (!match) return '#000000'

  const h = parseInt(match[1])
  const s = parseInt(match[2]) / 100
  const l = parseInt(match[3]) / 100

  // Converter HSL para RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h / 360 + 1 / 3)
    g = hue2rgb(p, q, h / 360)
    b = hue2rgb(p, q, h / 360 - 1 / 3)
  }

  // Converter RGB para HEX
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export default function ColorPicker({
  label,
  description,
  value,
  onChange,
}: ColorPickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempColor, setTempColor] = useState(hslToHex(value))
  const modalRef = useRef<HTMLDivElement>(null)

  // Reset temp color when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTempColor(hslToHex(value))
    }
  }, [isModalOpen, value])

  // Fechar modal quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false)
      }
    }

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalOpen])

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isModalOpen])

  const handleSave = () => {
    // Converter HEX para HSL antes de salvar
    const hslColor = hexToHsl(tempColor)
    onChange(hslColor)
    setIsModalOpen(false)
  }

  const presetColors = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#84cc16',
    '#000000',
    '#ffffff',
    '#64748b',
    '#475569',
  ]

  return (
    <>
      {/* Item de Cor */}
      <div className="space-y-3 p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground text-sm group-hover:text-foreground/90">
              {label}
            </h4>
            <p className="text-muted-foreground text-xs mt-1 group-hover:text-muted-foreground/90">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <div
              className="w-10 h-10 rounded border-2 border-border cursor-pointer transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
              style={{ backgroundColor: value }}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Valor:</span>
          <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">
            {value}
          </code>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-2 text-xs border border-border rounded-lg bg-background text-foreground hover:bg-accent transition-colors font-medium"
        >
          Editar Cor
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">
                Selecionar Cor - {label}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-accent"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Color Picker - Centralizado */}
              <div className="flex justify-center mb-6">
                <HexColorPicker
                  color={tempColor}
                  onChange={setTempColor}
                  className="w-full max-w-[300px] h-48"
                />
              </div>

              {/* Input e Preview - Alinhados */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-border shrink-0 shadow-sm"
                  style={{ backgroundColor: tempColor }}
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Valor HEX:
                  </label>
                  <input
                    type="text"
                    value={tempColor}
                    onChange={(e) => setTempColor(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-colors"
                    placeholder="#000000"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Digite um valor HEX ou use o seletor acima
                  </p>
                </div>
              </div>

              {/* Cores pré-definidas */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Cores rápidas:
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {presetColors.map((presetColor) => (
                    <button
                      key={presetColor}
                      className="w-8 h-8 rounded-lg border border-border transition-all duration-200 hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
                      style={{ backgroundColor: presetColor }}
                      onClick={() => setTempColor(presetColor)}
                      title={presetColor}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-border bg-muted/20">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
              >
                Aplicar Cor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
