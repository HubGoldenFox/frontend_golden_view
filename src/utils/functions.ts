export function getChangedFields<T extends Record<string, unknown>>(
  original: T,
  updated: T
): Partial<T> {
  const changed: Partial<T> = {}

  for (const key in updated) {
    if (updated[key] !== original[key]) {
      changed[key] = updated[key]
    }
  }

  return changed
}

const DELIMITER = '|'

export function arrayToString(array: string[]): string {
  return `${DELIMITER}${array.join(DELIMITER)}${DELIMITER}`
}

export function stringToArray(string: string): string[] {
  return string.slice(1, -1).split(DELIMITER).filter(Boolean)
}

type EmptyValue = null | ''

export function removeEmptyValues<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  // Cria uma cópia do objeto para não modificar o original
  const result: Partial<T> = Array.isArray(obj) ? ([] as any) : {}

  for (const [key, value] of Object.entries(obj)) {
    const typedKey = key as keyof T

    // Se o valor não for null nem string vazia, adiciona ao resultado
    if (value !== null && value !== '') {
      // Se for um objeto, chama a função recursivamente
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedValue = removeEmptyValues(value as Record<string, any>)
        // Só adiciona se o objeto limpo não estiver vazio
        if (Object.keys(cleanedValue).length > 0) {
          result[typedKey] = cleanedValue as T[keyof T]
        }
      } else if (Array.isArray(value)) {
        // Para arrays, filtra os valores vazios e mantém o array
        const filteredArray = value.filter(
          (item) => item !== null && item !== ''
        )
        if (filteredArray.length > 0) {
          result[typedKey] = filteredArray as T[keyof T]
        }
      } else {
        result[typedKey] = value
      }
    }
  }

  return result
}

import axios, { AxiosError } from 'axios'

// tratativa das mensagens de erros
export const msgError = (error: unknown): { message: string } => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError

    // Verificando se existe uma resposta do servidor
    if (axiosError.response) {
      const { status, data } = axiosError.response

      // Tratando alguns códigos de erro HTTP específicos
      switch (status) {
        case 404:
          return { message: 'Recurso não encontrado (404).' }
        case 500:
          return { message: 'Erro interno do servidor (500).' }
        default:
          // Verificando se 'detail' ou 'message' estão presentes
          if (data && typeof data === 'object') {
            if ('detail' in data && typeof data.detail === 'string') {
              return { message: data.detail }
            } else if (
              'detail' in data &&
              Array.isArray(data.detail) &&
              data.detail[0]?.msg
            ) {
              return { message: data.detail[0].msg }
            } else if ('message' in data && typeof data.message === 'string') {
              return { message: data.message }
            }
          }
          // Mensagem genérica para outros códigos de status
          return { message: `Erro inesperado: ${status}` }
      }
    } else if (axiosError.request) {
      // Erro de rede ou timeout (requisição foi feita, mas sem resposta)
      if (axiosError.code === 'ECONNABORTED') {
        return {
          message: 'A requisição demorou muito e foi abortada (timeout).',
        }
      } else {
        return {
          message: 'Falha na conexão com o servidor. Verifique sua internet.',
        }
      }
    } else {
      // Erros que ocorreram durante a configuração da requisição
      return { message: axiosError.message || 'Ocorreu um erro desconhecido.' }
    }
  } else {
    // Para erros que não são do Axios
    return { message: 'Ocorreu um erro inesperado!' }
  }
}

// para criar um objeto com as diferenças entre dois objetos para patch
export const getDifferences = <T>(
  obj1: Partial<T>,
  obj2: Partial<T>
): Partial<T> => {
  const differences: Partial<T> = {}

  Object.keys(obj2).forEach((key) => {
    if (obj1[key as keyof T] !== obj2[key as keyof T]) {
      differences[key as keyof T] = obj2[key as keyof T]
    }
  })

  return differences
}

export function truncarTexto(texto: string, limite = 50) {
  if (typeof texto !== 'string') {
    return '' // ou lançar um erro, dependendo do caso
  }

  if (texto.length <= limite) {
    return texto // Retorna o texto original se for menor ou igual ao limite
  }

  return texto.substring(0, limite) + ' ...' // Corta e adiciona "..."
}
