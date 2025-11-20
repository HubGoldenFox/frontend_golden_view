// Utilitários para máscaras
export const masks = {
  phone: (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  },

  cpf: (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  },

  cnpj: (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    )
  },

  cep: (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
  },

  currency: (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const number = Number.parseFloat(cleaned) / 100
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(number)
  },
}

export const unmasks = {
  phone: (value: string) => value.replace(/\D/g, ''),
  cpf: (value: string) => value.replace(/\D/g, ''),
  cnpj: (value: string) => value.replace(/\D/g, ''),
  cep: (value: string) => value.replace(/\D/g, ''),
  currency: (value: string) => value.replace(/\D/g, ''),
}

// Validadores comuns
export const validators = {
  phone: /^\d{10,11}$/, // Apenas números, 10 ou 11 dígitos
  cpf: /^\d{11}$/,
  cnpj: /^\d{14}$/,
  cep: /^\d{8}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}

// Função genérica para aplicar máscaras
export const applyMask = (
  value: string,
  maskType: keyof typeof masks
): string => {
  if (!value) return ''
  const maskFunction = masks[maskType]
  return maskFunction ? maskFunction(value) : value
}

// Função genérica para remover máscaras
export const removeMask = (
  value: string,
  maskType: keyof typeof unmasks
): string => {
  if (!value) return ''
  const unmaskFunction = unmasks[maskType]
  return unmaskFunction ? unmaskFunction(value) : value
}

// Hook para usar máscaras
export const useMask = (maskType: keyof typeof masks) => {
  const applyMaskToValue = (value: string) => applyMask(value, maskType)
  const removeMaskFromValue = (value: string) =>
    removeMask(value, maskType as keyof typeof unmasks)

  return {
    mask: applyMaskToValue,
    unmask: removeMaskFromValue,
    validator: validators[maskType as keyof typeof validators],
  }
}
