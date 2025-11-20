import { AppSchemaUsuariosSchemaGetUsuariosOutput as Usuario } from '@/client/types.gen'
import api from '@/config/axiosConfig'
import axios from 'axios'

/** ======== Tipos ======== **/
export interface LoginResponse {
  access_token: string
  token_type: string
  user: Usuario
  permissions: string[]
  papel?: string
}

interface TypeAuthResponse {
  token: string
}

/** ======== Funções de autenticação ======== **/

/**
 * Faz login com username e password.
 * Retorna os dados da sessão.
 */
export const apiLogin = async (
  username: string,
  password: string,
  tenantID?: string | null
): Promise<LoginResponse> => {
  const processedUsername = username.trim().toLowerCase()
  const urlEncodedData = new URLSearchParams()
  urlEncodedData.append('username', processedUsername)
  urlEncodedData.append('password', password)

  const response = await api.post<LoginResponse>(
    '/login/access-token',
    urlEncodedData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(tenantID
          ? { 'X-Tenant-ID': `tenant_${tenantID.replaceAll('-', '_')}` }
          : {}),
      },
    }
  )

  return response.data
}

/**
 * Envia um e-mail para redefinição de senha.
 */
export const sendEmail = async (
  email: string,
  tenantID?: string
): Promise<TypeAuthResponse> => {
  const response = await axios.post<TypeAuthResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/esqueci-senha/`,
    {
      email,
    },
    {
      headers: {
        ...(tenantID
          ? { 'X-Tenant-ID': `tenant_${tenantID.replaceAll('-', '_')}` }
          : {}),
      },
    }
  )

  return response.data
}

/**
 * Envia o código de verificação recebido por e-mail.
 */
export const sendCode = async (
  code: string,
  token: string,
  tenantID?: string
): Promise<TypeAuthResponse> => {
  const response = await axios.post<TypeAuthResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/esqueci-senha/code`,
    null,
    {
      params: {
        code: code,
      },
      headers: {
        Authentication: token,
        ...(tenantID
          ? { 'X-Tenant-ID': `tenant_${tenantID.replaceAll('-', '_')}` }
          : {}),
      },
    }
  )

  return response.data
}

/**
 * Define uma nova senha após validação do código.
 */
export const sendNewPassword = async (
  password: string,
  token: string,
  tenantID?: string
): Promise<TypeAuthResponse> => {
  const response = await axios.put<TypeAuthResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/nova-senha/`,
    { senha: password },
    {
      headers: {
        Authentication: token,
        ...(tenantID
          ? { 'X-Tenant-ID': `tenant_${tenantID.replaceAll('-', '_')}` }
          : {}),
      },
    }
  )

  return response.data
}
