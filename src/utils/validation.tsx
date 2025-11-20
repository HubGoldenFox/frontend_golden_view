// utils/validation.ts
import { FormField } from '@/types/form'

// Função auxiliar para converter valores para string de forma segura
const safeString = (value: any): string => {
  if (value === null || value === undefined) return ''
  return String(value)
}

// Função auxiliar para converter valores para número de forma segura
const safeNumber = (value: any): number => {
  if (value === null || value === undefined) return NaN
  const num = Number(value)
  return isNaN(num) ? NaN : num
}

// Função auxiliar para validar pattern de forma segura
const validatePattern = (pattern: any, value: any): boolean => {
  if (!value) return true

  const stringValue = safeString(value)

  if (pattern instanceof RegExp) {
    return pattern.test(stringValue)
  }

  if (typeof pattern === 'string') {
    try {
      const regex = new RegExp(pattern)
      return regex.test(stringValue)
    } catch (error) {
      console.error('Regex inválida:', pattern, error)
      return true
    }
  }

  console.error('Tipo de pattern inválido:', typeof pattern)
  return true
}

// Função para validar CPF
const validateCPF = (cpf: string): boolean => {
  const cpfNumbers = cpf.replace(/\D/g, '')

  // Verifica se tem 11 dígitos
  if (cpfNumbers.length !== 11) {
    return false
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpfNumbers)) {
    return false
  }

  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpfNumbers.charAt(i)) * (10 - i)
  }
  let remainder = 11 - (sum % 11)
  let digit = remainder >= 10 ? 0 : remainder

  if (digit !== parseInt(cpfNumbers.charAt(9))) {
    return false
  }

  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpfNumbers.charAt(i)) * (11 - i)
  }
  remainder = 11 - (sum % 11)
  digit = remainder >= 10 ? 0 : remainder

  if (digit !== parseInt(cpfNumbers.charAt(10))) {
    return false
  }

  return true
}

// Função para validar telefone
const validatePhone = (phone: string): boolean => {
  const phoneNumbers = phone.replace(/\D/g, '')

  // Verifica se tem entre 8 e 13 dígitos
  if (phoneNumbers.length < 8 || phoneNumbers.length > 13) {
    return false
  }

  // Verifica se é um telefone válido (apenas números)
  if (!/^\d+$/.test(phoneNumbers)) {
    return false
  }

  return true
}

// Função para validar CNPJ
const validateCNPJ = (cnpj: string): boolean => {
  const cnpjNumbers = cnpj.replace(/\D/g, '')

  // Verifica se tem 14 dígitos
  if (cnpjNumbers.length !== 14) {
    return false
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpjNumbers)) {
    return false
  }

  // Validação do primeiro dígito verificador
  let size = cnpjNumbers.length - 2
  let numbers = cnpjNumbers.substring(0, size)
  const digits = cnpjNumbers.substring(size)
  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) {
    return false
  }

  // Validação do segundo dígito verificador
  size = size + 1
  numbers = cnpjNumbers.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) {
    return false
  }

  return true
}

// Função para validar CEP
const validateCEP = (cep: string): boolean => {
  const cepNumbers = cep.replace(/\D/g, '')

  // Verifica se tem 8 dígitos
  if (cepNumbers.length !== 8) {
    return false
  }

  // Verifica se é um CEP válido (apenas números e formato brasileiro)
  if (!/^\d{8}$/.test(cepNumbers)) {
    return false
  }

  // CEPs com todos os dígitos iguais são inválidos
  if (/^(\d)\1+$/.test(cepNumbers)) {
    return false
  }

  return true
}

export const validateField = (
  field: FormField,
  value: any,
  formData?: Record<string, any>
): string[] => {
  const errors: string[] = []

  // Validação required
  const isEmpty =
    value === null || value === undefined || value === '' || value === false
  if (field.required && isEmpty) {
    errors.push(
      field.validation?.customMessage || `${field.label} é obrigatório`
    )
    return errors // Se é required e está vazio, não valida outras regras
  }

  // Se o campo está vazio e não é required, não aplica outras validações
  if (isEmpty) {
    return errors
  }

  // Validações específicas por tipo de campo
  const stringValue = safeString(value)

  switch (field.type) {
    case 'cpf':
      const cpfNumbers = stringValue.replace(/\D/g, '')
      if (cpfNumbers.length !== 11) {
        errors.push('CPF deve ter 11 dígitos')
      } else if (!validateCPF(cpfNumbers)) {
        errors.push('CPF inválido')
      }
      break

    case 'phone':
      const phoneNumbers = stringValue.replace(/\D/g, '')
      if (phoneNumbers.length < 8 || phoneNumbers.length > 13) {
        errors.push('Telefone deve ter entre 8 e 13 dígitos')
      } else if (!validatePhone(stringValue)) {
        errors.push('Telefone inválido')
      }
      break

    case 'cnpj':
      const cnpjNumbers = stringValue.replace(/\D/g, '')
      if (cnpjNumbers.length !== 14) {
        errors.push('CNPJ deve ter 14 dígitos')
      } else if (!validateCNPJ(cnpjNumbers)) {
        errors.push('CNPJ inválido')
      }
      break

    case 'cep':
      const cepNumbers = stringValue.replace(/\D/g, '')
      if (cepNumbers.length !== 8) {
        errors.push('CEP deve ter 8 dígitos')
      } else if (!validateCEP(cepNumbers)) {
        errors.push('CEP inválido')
      }
      break
  }

  // Processar regras de validação
  if (field.validation?.rules) {
    for (const rule of field.validation.rules) {
      if (rule.type === 'required') continue

      let isValid = true

      try {
        switch (rule.type) {
          case 'minLength':
            // Para CPF, telefone, CNPJ e CEP, considera apenas os números na validação de length
            let valueToCheck = stringValue
            if (['cpf', 'phone', 'cnpj', 'cep'].includes(field.type)) {
              valueToCheck = stringValue.replace(/\D/g, '')
            }
            isValid = valueToCheck.length >= Number(rule.value)
            break

          case 'maxLength':
            // Para CPF, telefone, CNPJ e CEP, considera apenas os números na validação de length
            let valueToCheckMax = stringValue
            if (['cpf', 'phone', 'cnpj', 'cep'].includes(field.type)) {
              valueToCheckMax = stringValue.replace(/\D/g, '')
            }
            isValid = valueToCheckMax.length <= Number(rule.value)
            break

          case 'min':
            isValid = safeNumber(value) >= Number(rule.value)
            break

          case 'max':
            isValid = safeNumber(value) <= Number(rule.value)
            break

          case 'pattern':
            isValid = validatePattern(rule.value, value)
            break

          case 'custom':
            isValid = rule.validator ? rule.validator(value, formData) : true
            break

          default:
            isValid = true
        }
      } catch (error) {
        console.error(`Erro na validação do campo ${field.name}:`, error)
        isValid = true
      }

      if (!isValid) {
        errors.push(rule.message)
      }
    }
  }

  // Validações da estrutura antiga (para compatibilidade)
  if (field.validation) {
    const { pattern, minLength, maxLength, min, max, customMessage } =
      field.validation

    try {
      if (pattern && !validatePattern(pattern, value)) {
        errors.push(customMessage || `${field.label} está em formato inválido`)
      }

      // Para minLength e maxLength em CPF/telefone/CNPJ/CEP, considerar apenas números
      let valueForLength = stringValue
      if (
        ['cpf', 'phone', 'cnpj', 'cep'].includes(field.type) &&
        (minLength || maxLength)
      ) {
        valueForLength = stringValue.replace(/\D/g, '')
      }

      if (minLength && valueForLength.length < minLength) {
        errors.push(
          customMessage ||
            `${field.label} deve ter pelo menos ${minLength} caracteres`
        )
      }

      if (maxLength && valueForLength.length > maxLength) {
        errors.push(
          customMessage ||
            `${field.label} deve ter no máximo ${maxLength} caracteres`
        )
      }

      if (min !== undefined && safeNumber(value) < min) {
        errors.push(
          customMessage || `${field.label} deve ser maior ou igual a ${min}`
        )
      }

      if (max !== undefined && safeNumber(value) > max) {
        errors.push(
          customMessage || `${field.label} deve ser menor ou igual a ${max}`
        )
      }
    } catch (error) {
      console.error(`Erro na validação legada do campo ${field.name}:`, error)
    }
  }

  return errors
}
