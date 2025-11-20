// components/custom/CepField.tsx
import { buscaCEP, ViaCEPResponse } from '@/services/cepService'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

interface CepFieldProps {
  value: string
  onChange: (value: string) => void
  onAddressFetched?: (address: Partial<ViaCEPResponse>) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export const CepField: React.FC<CepFieldProps> = ({
  value,
  onChange,
  onAddressFetched,
  disabled = false,
  placeholder = '00000-000',
  className = '',
}) => {
  const [loading, setLoading] = useState(false)

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 8)
    if (numbers.length <= 5) {
      return numbers
    } else {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    const formattedValue = formatCEP(rawValue)

    onChange(rawValue) // Envia o valor sem formatação para o form

    // Busca automática quando o CEP estiver completo
    if (rawValue.length === 8 && !disabled) {
      setLoading(true)

      try {
        const endereco = await buscaCEP(rawValue)

        if (endereco && onAddressFetched) {
          onAddressFetched({
            logradouro: endereco.logradouro,
            bairro: endereco.bairro,
            localidade: endereco.localidade,
            uf: endereco.uf,
            complemento: endereco.complemento,
          })
        }
      } catch (error) {
        // console.error('Erro ao buscar CEP:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={formatCEP(value)}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={9}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
          disabled ? 'bg-muted cursor-not-allowed' : 'bg-background'
        } ${className}`}
      />
      {loading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
