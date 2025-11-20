// hooks/useFormErrors.ts
import { handleApiError, isValidationError } from '@/utils/handlers'
import { useCallback, useState } from 'react'

export function useFormErrors() {
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({}) // 🔥 NOME DIFERENTE
  const [globalError, setGlobalError] = useState<string>('')

  // 🔥 FUNÇÃO SÓ para processar erros da API
  const processApiError = useCallback(
    (error: unknown, availableFields: string[]): boolean => {
      const apiError = handleApiError(error)

      if (isValidationError(apiError)) {
        const fieldErrors: Record<string, string[]> = {}

        apiError.detail.forEach((detail) => {
          if (detail.loc && detail.loc.length > 0) {
            const fieldName = detail.loc[detail.loc.length - 1]

            if (availableFields.includes(fieldName)) {
              if (!fieldErrors[fieldName]) {
                fieldErrors[fieldName] = []
              }
              fieldErrors[fieldName].push(detail.msg)
            }
          }
        })

        setApiErrors(fieldErrors) // 🔥 Seta APENAS erros da API
        return true
      } else {
        setGlobalError(apiError.detail[0]?.msg || 'Erro desconhecido')
        return false
      }
    },
    []
  )

  const clearApiErrors = useCallback(() => {
    setApiErrors({})
    setGlobalError('')
  }, [])

  return {
    apiErrors,
    globalError,
    clearApiErrors,
    processApiError,
  }
}
