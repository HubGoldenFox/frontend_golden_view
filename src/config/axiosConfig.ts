import { client } from '@/client/client.gen'
import { handleApiError } from '@/utils/handlers'
import axios, { AxiosError, AxiosInstance } from 'axios'
import { redirect } from 'next/navigation'

/* ================================================================ */
/* 🔹 Tipos utilitários                                              */
/* ================================================================ */
export interface Meta {
  total_items?: number
  total_query?: number
  items_per_page?: number
  current_page?: number
  total_pages?: number
  next_cursor?: string
  prev_cursor?: string
  has_next?: boolean
  has_prev?: boolean
}

export interface ApiSuccess<T> {
  msg?: string | null
  meta?: Meta | null
  data?: T[] | null
}

export interface Detail {
  msg: string
  loc?: string[]
  type?: string
  debug?: string
}

export interface ApiError {
  detail: Detail[]
}

/* ================================================================ */
/* 🔹 Estado atual global do client                                  */
/* ================================================================ */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:3000'

let currentTenantId: string | null = null
let currentToken: string | null = null

/* ================================================================ */
/* 🔹 Instância separada para requisições manuais                    */
/* ================================================================ */
let api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

/* ================================================================ */
/* 🔹 Interceptador global de erros                                  */
/* ================================================================ */
const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
      const status = error.response?.status
      handleApiError(error)

      if (status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('sessao')
        redirect('/login')
      }

      return Promise.reject(error)
    }
  )
}

setupInterceptors(api)
setupInterceptors(client.instance)

/* ================================================================ */
/* 🔹 Configura o client global do HeyAPI e axios                    */
/* ================================================================ */
export const configureAPI = (config: {
  token?: string | null
  tenantId?: string | null
}) => {
  currentToken = config.token ?? null
  currentTenantId = config.tenantId ?? null

  // --- Configura HeyAPI (client gerado)
  client.setConfig({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
      ...(currentTenantId
        ? { 'X-Tenant-ID': `tenant_${currentTenantId.replaceAll('-', '_')}` }
        : {}),
    },
  })

  // --- Recria instância Axios ad-hoc com mesmas configs
  api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
      ...(currentTenantId
        ? { 'X-Tenant-ID': `tenant_${currentTenantId.replaceAll('-', '_')}` }
        : {}),
    },
  })

  setupInterceptors(api)
}

/* ================================================================ */
/* 🔹 Inicialização automática                                       */
/* ================================================================ */
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('sessao')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      configureAPI({
        token: parsed.access_token,
        tenantId: parsed.user?.tenant_id ?? null,
      })
    } catch {
      // ignora erro de parse
    }
  }
}

/* ================================================================ */
/* 🔹 Exportações finais                                             */
/* ================================================================ */
export { api }
export default api
