import {
  removerTenants as deleteRequest,
  lerTenants as getRequest,
  atualizarTenants as patchRequest,
  criarTenants as postRequest,
} from '@/client/sdk.gen'
import type {
  PatchTenants as PatchType,
  PostTenants as PostType,
  LerTenantsData as QueryParams,
  LerTenantsResponse as ResponseType,
} from '@/client/types.gen'
import { useCallback, useState } from 'react'

export const useHook = () => {
  const [state, setState] = useState({
    data: null as ResponseType | null,
    error: null as Error | null,
    isLoading: false,
  })

  const fetchData = useCallback(async (query?: QueryParams['query']) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await getRequest({ query })

      setState((prev) => ({
        ...prev,
        data: response.data ?? null,
        isLoading: false,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err as Error,
        isLoading: false,
      }))
      throw err
    }
  }, [])

  const create = useCallback(async (data: PostType) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      await postRequest({ body: data, throwOnError: true })
    } catch (err) {
      setState((prev) => ({ ...prev, error: err as Error, isLoading: false }))
      throw err
    }
  }, [])

  const update = useCallback(async (id: string, data: PatchType) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      await patchRequest({ body: data, path: { id }, throwOnError: true })
    } catch (err) {
      setState((prev) => ({ ...prev, error: err as Error, isLoading: false }))
      throw err
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      await deleteRequest({ path: { id }, throwOnError: true })
    } catch (err) {
      setState((prev) => ({ ...prev, error: err as Error, isLoading: false }))
      throw err
    }
  }, [])

  return {
    ...state,
    fetchData,
    create,
    update,
    remove,
  }
}
