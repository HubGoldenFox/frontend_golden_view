'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: (value: string) => string
  unmask?: (value: string) => string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, mask, unmask, onChange, value, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('')

    // Atualiza o valor de exibição quando o value prop muda
    React.useEffect(() => {
      if (value !== undefined) {
        const stringValue = String(value)
        setDisplayValue(mask ? mask(stringValue) : stringValue)
      }
    }, [value, mask])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value

      // Aplica máscara para exibição
      const maskedValue = mask ? mask(inputValue) : inputValue
      setDisplayValue(maskedValue)

      // Remove máscara para o valor real
      const realValue = unmask ? unmask(inputValue) : inputValue

      // Cria um novo evento com o valor real
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: realValue,
        },
      }

      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
