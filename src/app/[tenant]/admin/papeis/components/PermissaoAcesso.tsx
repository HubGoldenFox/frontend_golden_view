/* eslint-disable react-hooks/exhaustive-deps */
import {
  GetFuncionalidades,
  GetPapeis,
  GetPapeisFuncionalidades,
} from '@/client/types.gen'
import { useHook as useFuncionalidades } from '@/hooks/useFuncionalidades'
import { useHook as usePapelFuncionalidade } from '@/hooks/usePapelFuncionalidade'
import React, { useEffect, useState } from 'react'

interface PermissionModalProps {
  isOpen: boolean
  onClose: () => void
  data: GetPapeis | null
}

interface PermissionType {
  [key: string]: {
    [method: string]: boolean
  }
}

export const PermissionModal: React.FC<PermissionModalProps> = (props) => {
  const [functionalities, setFunctionalities] = useState<
    GetFuncionalidades[] | []
  >([])
  const [permissions, setPermissions] = useState<PermissionType>({})

  const {
    create,
    get: getPapelFuncionalidades,
    remove,
    data: papelFuncionalidades,
  } = usePapelFuncionalidade()
  const { data: funcionalidades, get: getFunc } = useFuncionalidades()

  const loadData = async () => {
    if (props.data) {
      await getFunc({
        offset: 0,
        limit: 1000,
      })
      await getPapelFuncionalidades({
        papel_id: props.data.id,
        offset: 0,
        limit: 1000,
      })
    }
  }

  const getFunctionalityKey = (func: GetFuncionalidades): string => {
    // Remove o verbo (primeira palavra) e espaços extras
    return func.escopo?.split(':')[0] || ''
  }

  const updatePermissions = (
    endpoints: GetFuncionalidades[],
    roles: GetPapeisFuncionalidades[]
  ): void => {
    const newPermissions: PermissionType = {}

    endpoints.forEach((endpoint) => {
      if (!endpoint.escopo || !endpoint.metodo) return

      const key = getFunctionalityKey(endpoint)
      const method = endpoint.metodo.toLowerCase()

      if (!newPermissions[key]) {
        newPermissions[key] = {}
      }

      // Verifica se a funcionalidade está associada ao papel
      const hasPermission = roles.some(
        (role) => role.funcionalidade_id === endpoint.id
      )

      newPermissions[key][method] = hasPermission
    })

    setPermissions(newPermissions)
  }

  const handleCheckboxChange = async (
    functionality: string,
    method: string,
    value: boolean
  ) => {
    // Encontra a funcionalidade exata com base no summary e method
    const func = functionalities.find(
      (f) =>
        getFunctionalityKey(f) === functionality &&
        f.metodo?.toLowerCase() === method.toLowerCase()
    )

    if (!func || !props.data) return

    if (value) {
      // Criar permissão
      await create({
        papel_id: props.data.id ?? '',
        funcionalidade_id: func.id ?? '',
      })
    } else {
      // Remover permissão
      const roleFunc = papelFuncionalidades?.data?.find(
        (item) => item.funcionalidade_id === func.id
      )
      if (roleFunc?.id) {
        await remove(roleFunc.id)
      }
    }

    // Recarregar dados
    await getPapelFuncionalidades({
      papel_id: props.data.id,
      offset: 0,
      limit: 1000,
    })
  }

  useEffect(() => {
    if (
      funcionalidades &&
      funcionalidades?.data &&
      funcionalidades.data.length > 0
    ) {
      setFunctionalities(funcionalidades.data)
      updatePermissions(funcionalidades.data, papelFuncionalidades?.data || [])
    }
  }, [funcionalidades, papelFuncionalidades])

  useEffect(() => {
    if (props.data) {
      loadData()
    }
  }, [props.data])

  if (!props.isOpen) return null

  // Agrupa funcionalidades por nome (sem o verbo)
  const groupedFunctionalities = functionalities.reduce(
    (acc, func) => {
      if (!func.escopo || !func.metodo) return acc

      const key = getFunctionalityKey(func)
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(func)
      return acc
    },
    {} as Record<string, GetFuncionalidades[]>
  )

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-90" />

      <div className="w-full z-50 max-w-2xl bg-card text-card-foreground rounded-lg shadow-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-card-foreground text-center mb-8">
          Gerenciar Permissões
        </h2>
        <div className="space-y-6">
          <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
            <table className="min-w-full border-collapse border border-border">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left border-b border-border text-sm font-medium text-card-foreground">
                    Funcionalidade
                  </th>
                  <th className="px-4 py-2 border-b border-border text-sm font-medium text-card-foreground">
                    Pesquisar
                  </th>
                  <th className="px-4 py-2 border-b border-border text-sm font-medium text-card-foreground">
                    Criar
                  </th>
                  <th className="px-4 py-2 border-b border-border text-sm font-medium text-card-foreground">
                    Atualizar
                  </th>
                  <th className="px-4 py-2 border-b border-border text-sm font-medium text-card-foreground">
                    Excluir
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedFunctionalities).map(
                  ([functionality, funcs]) => (
                    <tr
                      key={functionality}
                      className="odd:bg-muted even:bg-card"
                    >
                      <td className="px-4 py-2 text-sm text-card-foreground border-b border-border">
                        {functionality}
                      </td>
                      {['GET', 'POST', 'PATCH', 'DELETE'].map((method) => {
                        const func = funcs.find((f) => f.metodo === method)
                        const isChecked = func
                          ? permissions[functionality]?.[
                              method.toLowerCase()
                            ] || false
                          : false

                        return (
                          <td
                            key={method}
                            className="px-4 py-2 text-center border-b border-border"
                          >
                            {func ? (
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    functionality,
                                    method,
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 text-primary border-border rounded focus:ring-primary bg-background"
                              />
                            ) : null}
                          </td>
                        )
                      })}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              onClick={props.onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
