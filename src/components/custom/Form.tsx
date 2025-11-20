// components/DynamicForm.tsx
import { Button } from '@/components/custom/Button'
import { CustomSelect } from '@/components/custom/SelectField'
import { useFormErrors } from '@/hooks/useFormErrors'
import { ViaCEPResponse } from '@/services/cepService'
import { DynamicFormProps, FormField } from '@/types/form'
import { validateField } from '@/utils/validation'
import {
  Edit,
  Eye,
  EyeOff,
  LogIn,
  Plus,
  Save,
  Send,
  Trash2,
  X,
} from 'lucide-react'
import React, { forwardRef, useImperativeHandle } from 'react'
import { CepField } from './CepField'

export const DynamicForm = forwardRef(function DynamicForm(
  {
    title,
    fields,
    onSubmit,
    loading = false,
    submitText = 'Enviar',
    gridCols = 2,
    initialData,
    mode = 'create',
    showActions = true,
    showCancel = true,
    onCancel,
    compact = false,
    showLogin = false,
    handleLogin,
  }: DynamicFormProps,
  ref: React.Ref<any>
) {
  const [formData, setFormData] = React.useState<Record<string, any>>({})
  const [errors, setErrors] = React.useState<Record<string, string[]>>({})
  const [isViewMode, setIsViewMode] = React.useState(mode === 'view')
  const [visiblePasswords, setVisiblePasswords] = React.useState<
    Record<string, boolean>
  >({})
  const [tagInputs, setTagInputs] = React.useState<Record<string, string>>({})
  const [isMobile, setIsMobile] = React.useState(false)

  const initializedRef = React.useRef(false)

  const { apiErrors, globalError, clearApiErrors, processApiError } =
    useFormErrors()

  const allErrors = {
    ...errors,
    ...apiErrors,
  }

  const fieldNames = fields.map((field) => field.name)

  // Detecta se está em mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px é o breakpoint padrão do Tailwind para md
    }

    // Verifica no carregamento inicial
    checkMobile()

    // Adiciona listener para redimensionamento
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Inicializar formData
  React.useEffect(() => {
    // Só inicializa uma vez ou quando initialData muda significativamente
    if (
      !initializedRef.current ||
      (initialData && JSON.stringify(initialData) !== JSON.stringify(formData))
    ) {
      const data: Record<string, any> = {}

      fields.forEach((field) => {
        if (initialData && initialData[field.name] !== undefined) {
          data[field.name] = initialData[field.name]
        } else {
          data[field.name] =
            field.defaultValue || (field.type === 'checkbox' ? false : '')
        }
      })

      setFormData(data)
      initializedRef.current = true
    }
  }, [fields, initialData])

  // Funções de formatação para CPF
  const formatCPF = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '').slice(0, 11)

    // Aplica a máscara conforme o usuário digita
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    } else {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
    }
  }

  const unformatCPF = (value: string): string => {
    return value.replace(/\D/g, '')
  }

  const resetForm = () => {
    setFormData({})
  }

  useImperativeHandle(ref, () => ({
    resetForm,
  }))

  // Funções de formatação para telefone
  const formatPhone = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')

    // Se não há números, retorna string vazia
    if (!numbers) return ''

    // Aplica a máscara conforme o número de dígitos
    if (numbers.length <= 4) {
      return numbers
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`
    } else if (numbers.length === 9) {
      return `${numbers.slice(0, 1)} ${numbers.slice(1, 5)}-${numbers.slice(5)}`
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    } else if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7)}`
    } else if (numbers.length === 12) {
      return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 8)}-${numbers.slice(8)}`
    } else {
      return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 5)} ${numbers.slice(5, 9)}-${numbers.slice(9, 13)}`
    }
  }

  const unformatPhone = (value: string): string => {
    return value.replace(/\D/g, '')
  }

  const formatCNPJ = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '').slice(0, 14)

    // Aplica a máscara conforme o usuário digita
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
    } else if (numbers.length <= 12) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
    } else {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
    }
  }

  const unformatCNPJ = (value: string): string => {
    return value.replace(/\D/g, '')
  }

  const formatCEP = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '').slice(0, 8)

    // Aplica a máscara conforme o usuário digita
    if (numbers.length <= 5) {
      return numbers
    } else {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
    }
  }

  // Toggle para mostrar/ocultar senha
  const togglePasswordVisibility = (fieldName: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  const handleChange = (name: string, value: any) => {
    if (isViewMode) return

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Validação em tempo real
    if (errors[name]) {
      const field = fields.find((f) => f.name === name)
      if (field) {
        const newErrors = validateField(field, value, formData)
        setErrors((prev) => ({
          ...prev,
          [name]: newErrors,
        }))
      }
    }
  }

  const handleCepFetched = (address: Partial<ViaCEPResponse>) => {
    if (
      address.logradouro &&
      address.bairro &&
      address.localidade &&
      address.uf
    ) {
      setFormData((prev) => ({
        ...prev,
        endereco: address.logradouro,
        bairro: address.bairro,
        cidade: address.localidade,
        estado: address.uf,
        complemento: address.complemento || prev.complemento,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {}
    let isValid = true

    fields.forEach((field) => {
      const fieldErrors = validateField(field, formData[field.name], formData)
      if (fieldErrors.length > 0) {
        newErrors[field.name] = fieldErrors
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isViewMode) return

    // Limpa todos os erros antes de validar
    setErrors({})
    clearApiErrors()

    if (validateForm()) {
      try {
        await onSubmit(formData)
      } catch (error) {
        processApiError(error, fieldNames)
      }
    }
  }

  const toggleViewMode = () => {
    setIsViewMode(!isViewMode)
  }

  // Funções para manipulação de tags
  const handleAddTag = (fieldName: string, tag: string) => {
    if (!tag.trim()) return

    const currentTags = formData[fieldName] || []
    const field = fields.find((f) => f.name === fieldName)

    // Verificar limite máximo de tags
    if (
      field?.tagConfig?.maxTags &&
      currentTags.length >= field.tagConfig.maxTags
    ) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: [`Máximo de ${field.tagConfig?.maxTags} tags permitidas`],
      }))
      return
    }

    // Verificar se tag já existe
    if (currentTags.includes(tag.trim())) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: ['Esta tag já foi adicionada'],
      }))
      return
    }

    const newTags = [...currentTags, tag.trim()]
    handleChange(fieldName, newTags)
    setTagInputs((prev) => ({ ...prev, [fieldName]: '' }))
    setErrors((prev) => ({ ...prev, [fieldName]: [] }))
  }

  const handleRemoveTag = (fieldName: string, tagToRemove: string) => {
    const currentTags = formData[fieldName] || []
    const newTags = currentTags.filter((tag: string) => tag !== tagToRemove)
    handleChange(fieldName, newTags)
  }

  const handleTagInputKeyDown = (fieldName: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const inputValue = tagInputs[fieldName] || ''
      handleAddTag(fieldName, inputValue)
    }
  }

  const handleTagInputChange = (fieldName: string, value: string) => {
    setTagInputs((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else if (initialData) {
      // Reset para dados iniciais
      const resetData: Record<string, any> = {}
      fields.forEach((field) => {
        resetData[field.name] =
          initialData[field.name] !== undefined
            ? initialData[field.name]
            : field.defaultValue || (field.type === 'checkbox' ? false : '')
      })
      setFormData(resetData)
      setErrors({})
      clearApiErrors()
    }

    if (mode === 'view') {
      setIsViewMode(true)
    }
  }

  const renderField = (field: FormField) => {
    const isDisabled = field.disabled || loading || isViewMode
    const isPasswordVisible = visiblePasswords[field.name] || false

    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      ) => handleChange(field.name, e.target.value),
      required: field.required && !isViewMode,
      disabled: isDisabled,
      placeholder: field.placeholder,
      className: `
        w-full px-3 py-2 border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring
        ${allErrors[field.name] && !isViewMode ? 'border-destructive' : 'border-input'}
        ${isDisabled ? 'bg-muted cursor-not-allowed' : 'bg-background'}
        ${isViewMode ? 'text-foreground bg-muted' : ''}
        ${field.className || ''}
      `,
    }

    // Estilo específico para modo visualização
    const viewModeClass = isViewMode
      ? 'bg-muted text-foreground px-3 py-2 rounded border border-transparent'
      : ''

    switch (field.type) {
      case 'password':
        if (isViewMode) {
          return (
            <div className={viewModeClass}>
              {formData[field.name] ? (
                '••••••••'
              ) : (
                <span className="text-gray-400">Não informado</span>
              )}
            </div>
          )
        }

        return (
          <div className="relative">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              {...commonProps}
              className={commonProps.className + ' pr-10'}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility(field.name)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              disabled={isDisabled}
            >
              {isPasswordVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        )

      case 'tag':
        if (isViewMode) {
          const tags = formData[field.name] || []
          return (
            <div className={viewModeClass}>
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-input text-foreground placeholder:text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">Nenhuma tag adicionada</span>
              )}
            </div>
          )
        }

        const tags = formData[field.name] || []
        const tagInputValue = tagInputs[field.name] || ''

        return (
          <div className="space-y-2">
            {/* Tags existentes */}
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-input text-foreground placeholder:text-muted-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(field.name, tag)}
                    disabled={isDisabled}
                    className="hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Controle para adicionar tags */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={field.tagConfig?.placeholder || 'Adicionar tag'}
                value={tagInputValue}
                onChange={(e) =>
                  handleTagInputChange(field.name, e.target.value)
                }
                onKeyDown={(e) => handleTagInputKeyDown(field.name, e)}
                disabled={isDisabled}
                className={commonProps.className + ' flex-1'}
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddTag(field.name, tagInputValue)}
                disabled={isDisabled || !tagInputValue.trim()}
                className="flex items-center gap-1 whitespace-nowrap shrink-0"
                size={isMobile ? 'sm' : undefined}
              >
                <Plus className="h-3 w-3" />
                {!isMobile && 'Adicionar'}
              </Button>
            </div>

            {/* Texto de ajuda */}
            {field.tagConfig?.helpText && (
              <p className="text-xs text-muted-foreground mt-1">
                {field.tagConfig.helpText}
              </p>
            )}

            {/* Mensagem de limite */}
            {field.tagConfig?.maxTags && (
              <p className="text-xs text-gray-500">
                {tags.length} / {field.tagConfig.maxTags} tags
              </p>
            )}
          </div>
        )

      case 'textarea':
        if (isViewMode) {
          return (
            <div className={viewModeClass}>
              {formData[field.name] || (
                <span className="text-gray-400">Não informado</span>
              )}
            </div>
          )
        }
        return <textarea {...commonProps} rows={4} />

      case 'select':
        if (isViewMode) {
          const selectedOption = field.options?.find(
            (opt) => opt.value === formData[field.name]
          )
          return (
            <div className={viewModeClass}>
              {selectedOption ? (
                selectedOption.label
              ) : (
                <span className="text-gray-400">Não selecionado</span>
              )}
            </div>
          )
        }

        // Usa CustomSelect se tiver selectConfig
        if (field.selectConfig) {
          return (
            <CustomSelect
              value={formData[field.name]}
              onChange={(value) => handleChange(field.name, value)}
              options={field.options || []}
              disabled={isDisabled}
              placeholder={field.placeholder || 'Selecione...'}
              searchable={field.selectConfig.searchable}
              asyncSearch={field.selectConfig.asyncSearch}
              onSearch={field.selectConfig.onSearch}
              loading={field.loading}
              minSearchLength={field.selectConfig.minSearchLength}
              noOptionsMessage={field.selectConfig.noOptionsMessage}
              menuPosition={field.selectConfig.menuPosition}
            />
          )
        }

        return (
          <select {...commonProps}>
            <option value="">Selecione...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        if (isViewMode) {
          return (
            <div className={viewModeClass}>
              {formData[field.name] ? (
                <span className="text-green-600">✓ Ativo</span>
              ) : (
                <span className="text-gray-400">✗ Inativo</span>
              )}
            </div>
          )
        }
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={!!formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              disabled={isDisabled}
              className="h-5 w-5 text-blue-600 rounded mt-0.5"
            />
            <span className="ml-2 leading-none">{field.placeholder}</span>
          </div>
        )

      case 'range':
        if (isViewMode) {
          return (
            <div className={viewModeClass}>
              {formData[field.name] ? (
                <span>{formData[field.name]}</span>
              ) : (
                <span className="text-gray-400">Não informado</span>
              )}
            </div>
          )
        }
        return (
          <div className="space-y-4">
            <input
              type="range"
              min={field?.validation?.min || '1'}
              max={field?.validation?.max || '5'}
              value={formData[field.name] || field?.validation?.min || '1'}
              onChange={(e) => handleChange(field.name, e.target.value)}
              disabled={isDisabled}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-gray-500 px-1">
              {Array.from(
                {
                  length:
                    (field?.validation?.max || 5) -
                    (field?.validation?.min || 1) +
                    1,
                },
                (_, i) => (field?.validation?.min || 1) + i
              ).map((num) => (
                <span
                  key={num}
                  className={`${num == (formData[field.name] || field?.validation?.min || '1') ? 'text-primary font-bold' : ''}`}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )

      case 'radio':
        if (isViewMode) {
          const selectedOption = field.options?.find(
            (opt) => opt.value === formData[field.name]
          )
          return (
            <div className={viewModeClass}>
              {selectedOption ? (
                selectedOption.label
              ) : (
                <span className="text-gray-400">Não selecionado</span>
              )}
            </div>
          )
        }
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={formData[field.name] === option.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={isDisabled}
                  className="h-4 w-4 text-blue-600"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'file':
        if (isViewMode) {
          const file = formData[field.name]
          return (
            <div className={viewModeClass}>
              {file ? (
                typeof file === 'string' ? (
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver arquivo
                  </a>
                ) : (
                  file.name
                )
              ) : (
                <span className="text-gray-400">Nenhum arquivo</span>
              )}
            </div>
          )
        }
        return (
          <input
            type="file"
            onChange={(e) => handleChange(field.name, e.target.files?.[0])}
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        )

      case 'cpf':
        if (isViewMode) {
          const formattedCPF = formData[field.name]
            ? formatCPF(formData[field.name])
            : ''
          return (
            <div className={viewModeClass}>
              {formattedCPF || (
                <span className="text-gray-400">Não informado</span>
              )}
            </div>
          )
        }

        return (
          <input
            type="text"
            {...commonProps}
            value={formatCPF(formData[field.name] || '')}
            onChange={(e) => {
              const rawValue = unformatCPF(e.target.value)
              handleChange(field.name, rawValue)
            }}
            maxLength={14}
            placeholder={field.placeholder || '000.000.000-00'}
          />
        )

      case 'phone':
        if (isViewMode) {
          const formattedPhone = formData[field.name]
            ? formatPhone(formData[field.name])
            : ''
          return (
            <div className={viewModeClass}>
              {formattedPhone || (
                <span className="text-gray-400">Não informado</span>
              )}
            </div>
          )
        }

        return (
          <input
            type="text"
            {...commonProps}
            value={formatPhone(formData[field.name] || '')}
            onChange={(e) => {
              const rawValue = unformatPhone(e.target.value)
              handleChange(field.name, rawValue)
            }}
            maxLength={20}
            placeholder={field.placeholder || '(00) 00000-0000'}
          />
        )

      case 'cnpj':
        if (isViewMode) {
          const formattedCNPJ = formData[field.name]
            ? formatCNPJ(formData[field.name])
            : ''
          return (
            <div className={viewModeClass}>
              {formattedCNPJ || (
                <span className="text-gray-400">Não informado</span>
              )}
            </div>
          )
        }

        return (
          <input
            type="text"
            {...commonProps}
            value={formatCNPJ(formData[field.name] || '')}
            onChange={(e) => {
              const rawValue = unformatCNPJ(e.target.value)
              handleChange(field.name, rawValue)
            }}
            maxLength={18}
            placeholder={field.placeholder || '00.000.000/0000-00'}
          />
        )

      case 'cep':
        if (isViewMode) {
          const formattedCEP = formData[field.name]
            ? formatCEP(formData[field.name])
            : ''
          return (
            <div className={viewModeClass}>
              {formattedCEP || (
                <span className="text-gray-400">Não informado</span>
              )}
            </div>
          )
        }

        return (
          <CepField
            value={formData[field.name] || ''}
            onChange={(value) => handleChange(field.name, value)}
            onAddressFetched={handleCepFetched}
            disabled={isDisabled}
            placeholder={field.placeholder || '00000-000'}
          />
        )

      default:
        if (isViewMode) {
          return (
            <div className={viewModeClass}>
              {formData[field.name] || (
                <span className="text-gray-400">Não informado</span>
              )}
            </div>
          )
        }
        return <input type={field.type} {...commonProps} />
    }
  }

  const getGridColClass = (colSpan: number = 1) => {
    // Em mobile, sempre col-span-1 (uma coluna)
    if (isMobile) {
      return 'col-span-1'
    }

    const colClasses = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
    }
    return colClasses[colSpan as keyof typeof colClasses] || 'col-span-1'
  }

  const getGridColsClass = () => {
    // Em mobile, sempre 1 coluna
    if (isMobile) {
      return 'grid-cols-1'
    }

    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    }
    return gridClasses[gridCols as keyof typeof gridClasses] || 'grid-cols-2'
  }

  const getButtonConfig = () => {
    if (mode === 'view') {
      return {
        primary: {
          icon: <Edit className="h-4 w-4" />,
          text: 'Editar',
          variant: 'primary' as const,
        },
        secondary: {
          icon: <X className="h-4 w-4" />,
          text: 'Voltar',
          variant: 'secondary' as const,
        },
      }
    }

    if (isViewMode && mode === 'edit') {
      return {
        primary: {
          icon: <Edit className="h-4 w-4" />,
          text: 'Editar',
          variant: 'primary' as const,
        },
        secondary: {
          icon: <X className="h-4 w-4" />,
          text: 'Cancelar',
          variant: 'secondary' as const,
        },
      }
    }

    return {
      primary: {
        icon:
          mode === 'create' ? (
            <Send className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          ),
        text: mode === 'create' ? submitText : 'Salvar',
        variant: 'primary' as const,
      },
      secondary: {
        icon: <X className="h-4 w-4" />,
        text: 'Cancelar',
        variant: 'secondary' as const,
      },
    }
  }

  const buttonConfig = getButtonConfig()

  return (
    <div className={`h-full flex flex-col ${compact ? 'compact-form' : ''}`}>
      {title && (
        <h2
          className={`font-semibold mb-4 ${compact ? 'text-lg' : 'text-2xl'} ${isMobile ? 'text-xl' : ''}`}
        >
          {title}
        </h2>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex-1 overflow-auto">
          <div className={`grid ${getGridColsClass()} gap-4`}>
            {fields.map((field) => (
              <div key={field.name} className={getGridColClass(field.colSpan)}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  {field.label}
                  {field.required && !isViewMode && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {renderField(field)}

                {errors[field.name] &&
                  errors[field.name].length > 0 &&
                  !isViewMode && (
                    <div className="mt-1 space-y-1">
                      {errors[field.name].map((error, index) => (
                        <p key={index} className="text-sm text-destructive">
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>

          {showActions && (
            <div
              className={`flex ${isMobile ? 'flex-col-reverse gap-3' : 'justify-end space-x-4'} pt-6`}
            >
              {showLogin === true && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogin}
                  disabled={loading}
                  className={`flex items-center space-x-2 ${isMobile ? 'w-full justify-center' : ''}`}
                  size={isMobile ? 'sm' : undefined}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Button>
              )}

              {showCancel === true && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className={`flex items-center space-x-2 ${isMobile ? 'w-full justify-center' : ''}`}
                  size={isMobile ? 'sm' : undefined}
                >
                  {buttonConfig.secondary.icon}
                  <span>{buttonConfig.secondary.text}</span>
                </Button>
              )}

              {(!isViewMode || mode === 'view') && (
                <Button
                  type={isViewMode ? 'button' : 'submit'}
                  onClick={isViewMode ? toggleViewMode : undefined}
                  variant="outline"
                  disabled={loading}
                  className={`flex items-center space-x-2 ${isMobile ? 'w-full justify-center' : ''}`}
                  size={isMobile ? 'sm' : undefined}
                >
                  {buttonConfig.primary.icon}
                  <span>{buttonConfig.primary.text}</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  )
})
