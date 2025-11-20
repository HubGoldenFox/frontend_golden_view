// types/form.ts
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'tag'
  | 'cpf'
  | 'phone'
  | 'range'
  | 'cnpj'
  | 'cep'

export interface TagFieldConfig {
  maxTags?: number
  placeholder?: string
  helpText?: string
}

export interface SelectConfig {
  searchable?: boolean
  asyncSearch?: boolean
  onSearch?: (searchTerm: string) => void
  minSearchLength?: number
  noOptionsMessage?: string
  menuPosition?: 'top' | 'bottom'
}

export interface CepAddress {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  complemento?: string
}

export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  disabled?: boolean
  placeholder?: string
  colSpan?: 1 | 2 | 3 | 4
  options?: Array<{
    label: string
    value: string | number
  }>
  validation?: {
    rules?: ValidationRule[]
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    customMessage?: string
  }
  defaultValue?: any
  className?: string
  selectConfig?: SelectConfig
  loading?: boolean
  tagConfig?: TagFieldConfig
}

export interface DynamicFormProps {
  title?: string
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => Promise
  loading?: boolean
  submitText?: string
  gridCols?: 1 | 2 | 3 | 4
  initialData?: Record<string, any>
  mode?: 'create' | 'edit' | 'view'
  showActions?: boolean
  showCancel?: boolean
  onCancel?: () => void
  compact?: boolean
  showLogin?: boolean
  handleLogin?: () => void
}

export interface ValidationRule {
  type:
    | 'required'
    | 'minLength'
    | 'maxLength'
    | 'min'
    | 'max'
    | 'pattern'
    | 'custom'
  value?: any
  message: string
  validator?: (value: any, formData?: Record<string, any>) => boolean
}
