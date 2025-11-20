import { AxiosError } from 'axios'

export interface Detail {
  msg: string
  loc?: string[]
  type?: string
  debug?: string
}

export interface ApiError {
  detail: Detail[]
}

// 🔥 ADICIONAR: Interface para resposta de erro genérica
interface ErrorResponse {
  message?: string
  error?: string
  detail?: any
}

// 🔥 ADICIONAR: Constantes para mensagens padrão
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Falha na conexão. Verifique sua internet',
  SERVER_ERROR: 'Erro interno do servidor',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente',
  FORBIDDEN: 'Você não tem permissão para esta ação',
  NOT_FOUND: 'Recurso não encontrado',
  TIMEOUT: 'Tempo de resposta esgotado',
  UNKNOWN: 'Erro inesperado',
  CORS_ERROR: 'Erro de CORS ou conexão. Verifique a URL do servidor',
  METHOD_NOT_ALLOWED: 'Método não permitido para este recurso',
  VALIDATION_ERROR: 'Erro de validação. Verifique os dados enviados',
} as const

export const handleApiError = (error: unknown): ApiError => {
  // Se for um erro de cancelamento do Axios, retorne sem mostrar toast
  if (isAxiosError(error) && error.code === 'ERR_CANCELED') {
    return { detail: [] }
  }

  // 🔥 ADICIONAR: Tratamento para timeout
  if (isAxiosError(error) && error.code === 'ECONNABORTED') {
    return {
      detail: [
        {
          msg: ERROR_MESSAGES.TIMEOUT,
          type: 'timeout_error',
          loc: [],
        },
      ],
    }
  }

  // Verificar primeiro se já é um ApiError válido
  if (isApiError(error)) {
    showToastIfNotValidation(error)
    return error
  }

  // Se for um erro do Axios com response.data no formato ApiError
  if (isAxiosError(error) && isApiError(error.response?.data)) {
    showToastIfNotValidation(error.response.data)
    return error.response.data
  }

  const detail: Detail = {
    msg: ERROR_MESSAGES.UNKNOWN,
    type: 'unknown_error',
    loc: [],
  }

  let isValidationError = false

  if (isAxiosError(error)) {
    // 🔥 CORREÇÃO: Usar type assertion para acessar as propriedades
    const responseData = error.response?.data as ErrorResponse | undefined

    detail.msg =
      responseData?.message ||
      responseData?.error ||
      error.message ||
      ERROR_MESSAGES.UNKNOWN

    if (error.response?.data && !isApiError(error.response.data)) {
      detail.debug = JSON.stringify(error.response.data)
    }

    if (error.response) {
      detail.type = getErrorTypeFromStatusCode(error.response.status)
      isValidationError = error.response.status === 422

      // Tratamento específico para 401 (logout)
      if (error.response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
        window.location.href = '/login'
      }

      switch (error.response.status) {
        case 400:
          detail.msg = 'Requisição inválida'
          break
        case 401:
          detail.msg = ERROR_MESSAGES.UNAUTHORIZED
          break
        case 403:
          detail.msg = ERROR_MESSAGES.FORBIDDEN
          break
        case 404:
          detail.msg = ERROR_MESSAGES.NOT_FOUND
          break
        case 405:
          detail.msg = ERROR_MESSAGES.METHOD_NOT_ALLOWED
          break
        case 409:
          detail.msg = 'Conflito no estado atual do recurso'
          break
        case 422:
          detail.msg = ERROR_MESSAGES.VALIDATION_ERROR
          break
        case 429:
          detail.msg = 'Muitas requisições. Tente novamente mais tarde'
          break
        case 500:
          detail.msg = ERROR_MESSAGES.SERVER_ERROR
          break
        case 502:
        case 503:
        case 504:
          detail.msg = 'Serviço temporariamente indisponível'
          break
      }
    } else if (error.request) {
      detail.type = 'network_error'
      detail.msg = ERROR_MESSAGES.NETWORK_ERROR
    }
  } else if (
    error instanceof TypeError &&
    error.message.includes('Failed to fetch')
  ) {
    // 🔥 ADICIONAR: Tratamento para CORS e erros de browser
    detail.type = 'cors_error'
    detail.msg = ERROR_MESSAGES.CORS_ERROR
  } else if (error instanceof Error) {
    detail.msg = error.message
    detail.type = 'client_error'
    detail.debug = error.stack
  }

  const apiError = { detail: [detail] }

  // 🔥 ADICIONAR: Mostrar toast apenas se não for erro de validação
  if (!isValidationError && detail.msg !== ERROR_MESSAGES.UNKNOWN) {
    // showToast(detail.msg) // Descomente se tiver sistema de toast
  }

  return apiError
}

// 🔥 ADICIONAR: Função auxiliar para verificar se é erro de validação
export const isValidationError = (error: ApiError): boolean => {
  return error.detail.some((d) => d.type === 'validation_error')
}

// 🔥 ADICIONAR: Verificar se o erro tem detalhes
export const hasError = (error: ApiError): boolean => {
  return (
    error.detail.length > 0 &&
    error.detail.some((d) => d.msg && d.msg !== ERROR_MESSAGES.UNKNOWN)
  )
}

// 🔥 ADICIONAR: Versão simplificada que retorna apenas a mensagem principal
export const getErrorMessage = (error: unknown): string => {
  const apiError = handleApiError(error)
  return apiError.detail[0]?.msg || ERROR_MESSAGES.UNKNOWN
}

// 🔥 ADICIONAR: Obter todos os erros como array de strings
export const getErrorMessages = (error: unknown): string[] => {
  const apiError = handleApiError(error)
  return apiError.detail.map((d) => d.msg).filter(Boolean)
}

// 🔥 ADICIONAR: Obter primeiro erro ou mensagem padrão
export const getFirstError = (
  error: unknown,
  defaultMessage?: string
): string => {
  const apiError = handleApiError(error)
  return apiError.detail[0]?.msg || defaultMessage || ERROR_MESSAGES.UNKNOWN
}

// Helper functions
function isApiError(error: any): error is ApiError {
  return error && Array.isArray(error.detail) && error.detail.every(isDetail)
}

function isDetail(detail: any): detail is Detail {
  return detail && typeof detail.msg === 'string'
}

function isAxiosError(error: any): error is AxiosError {
  return error && error.isAxiosError
}

function getErrorTypeFromStatusCode(status: number): string {
  const types: Record<number, string> = {
    400: 'bad_request',
    401: 'authentication_error',
    403: 'authorization_error',
    404: 'not_found_error',
    405: 'method_not_allowed',
    409: 'conflict_error',
    422: 'validation_error',
    429: 'rate_limit_error',
    500: 'server_error',
    502: 'gateway_error',
    503: 'service_unavailable',
    504: 'gateway_timeout',
  }
  return types[status] || 'unknown_error'
}

// 🔥 CORREÇÃO: Exportar a função cleanErrorMessage
export function cleanErrorMessage(msg: string): string {
  return msg
    .replace(/^(Value|Type|Assertion|Permission|Validation) error,\s*/i, '')
    .trim()
}

function showToastIfNotValidation(error: ApiError) {
  const isValidationError = error.detail.some(
    (d) => d.type === 'validation_error'
  )

  if (!isValidationError) {
    error.detail.forEach((d) => {
      if (d.msg) {
        const cleanedMsg = cleanErrorMessage(d.msg)
        // showToast(cleanedMsg) // Descomente se tiver sistema de toast
      }
    })
  }
}

// 🔥 ADICIONAR: Função para log de erros (útil para debugging)
export const logError = (error: unknown, context?: string) => {
  const apiError = handleApiError(error)

  console.error(`🚨 Error${context ? ` in ${context}` : ''}:`, {
    messages: getErrorMessages(error),
    details: apiError.detail,
    timestamp: new Date().toISOString(),
  })

  return apiError
}

// 🔥 ADICIONAR: Tipo guard para verificar se é erro de API
export function isApiErrorInstance(error: any): error is ApiError {
  return isApiError(error)
}

// 🔥 ADICIONAR: Criar erro de API a partir de mensagem
export const createApiError = (message: string, type?: string): ApiError => ({
  detail: [
    {
      msg: message,
      type: type || 'client_error',
      loc: [],
    },
  ],
})
