import { useEffect, useRef, useState } from 'react'

interface Option {
  value: string | number
  label: string
}

interface CustomSelectProps {
  value: string | number | null
  onChange: (value: string | number | null) => void
  options: Option[]
  disabled?: boolean
  placeholder?: string
  searchable?: boolean
  asyncSearch?: boolean
  onSearch?: (searchTerm: string) => void
  loading?: boolean
  noOptionsMessage?: string
  minSearchLength?: number
  menuPosition?: 'bottom' | 'top'
}

export function CustomSelect({
  value,
  onChange,
  options,
  disabled,
  placeholder = 'Selecione...',
  searchable = false,
  asyncSearch = false,
  onSearch,
  loading = false,
  noOptionsMessage = 'Nenhuma opção encontrada',
  minSearchLength = 1,
  menuPosition = 'bottom',
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  // Foca no input de busca quando o dropdown abre
  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [open, searchable])

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
        setSearchTerm('')
        setIsSearching(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Filtra opções localmente - agora usando options diretamente
  const filteredOptions =
    searchable && searchTerm && !asyncSearch
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options // Usa options diretamente em vez de localOptions

  // Manipula mudança no input de busca
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (asyncSearch && onSearch) {
      setIsSearching(true)

      const timeoutId = setTimeout(() => {
        if (term.length >= minSearchLength || term.length === 0) {
          onSearch(term)
        }
        setIsSearching(false)
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }

  // Limpa a busca
  const clearSearch = () => {
    setSearchTerm('')
    if (asyncSearch && onSearch) {
      onSearch('')
    }
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Seleciona uma opção
  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue)
    setOpen(false)
    setSearchTerm('')
    setIsSearching(false)
  }

  // Remove seleção atual
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    setSearchTerm('')
  }

  // Carrega opções iniciais quando o dropdown abre (para asyncSearch)
  const handleOpenDropdown = () => {
    if (!disabled) {
      setOpen(!open)

      // Se for busca assíncrona e ainda não tem opções, carrega as iniciais
      if (!open && asyncSearch && onSearch && options.length === 0) {
        onSearch('')
      }
    }
  }

  // Classes condicionais para posicionamento do menu
  const menuClasses =
    menuPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'

  // Classes condicionais para a seta
  const arrowClasses = open
    ? menuPosition === 'top'
      ? 'rotate-0'
      : 'rotate-180'
    : 'rotate-0'

  return (
    <div className="relative w-full" ref={ref}>
      {/* Container principal */}
      <div
        className={`
          w-full flex justify-between items-center rounded-md border border-input bg-input py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-ring
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-accent-foreground/50'}
          text-sm text-foreground
        `}
        onClick={handleOpenDropdown}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleOpenDropdown()
          }
        }}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={
            !selectedOption ? 'text-muted-foreground' : 'text-foreground'
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center space-x-2">
          {/* Botão de limpar */}
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground p-1 rounded focus:outline-none focus:ring-1 focus:ring-ring"
              title="Limpar seleção"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Ícone seta */}
          <svg
            className={`h-4 w-4 text-muted-foreground transition-transform ${arrowClasses}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute ${menuClasses} w-full rounded-md border border-border bg-card shadow-lg z-10 max-h-60 overflow-hidden flex flex-col`}
        >
          {/* Input de busca */}
          {searchable && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Buscar..."
                  className="w-full pl-8 pr-8 py-2 border border-input bg-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Ícone de busca */}
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Botão de limpar busca */}
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Informações da busca */}
              {asyncSearch && (
                <div className="text-xs text-muted-foreground mt-1 px-1">
                  {searchTerm.length < minSearchLength &&
                  searchTerm.length > 0 ? (
                    <span>
                      Digite pelo menos {minSearchLength} caracteres...
                    </span>
                  ) : isSearching || loading ? (
                    <span>Buscando...</span>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* Lista de opções - agora usando options diretamente */}
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground text-sm">
                {loading || isSearching ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-muted-foreground"></div>
                    <span>Carregando...</span>
                  </div>
                ) : (
                  noOptionsMessage
                )}
              </div>
            ) : (
              <ul role="listbox">
                {filteredOptions.map((opt) => {
                  const isSelected = opt.value === value
                  return (
                    <li
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`
                        flex items-center justify-between cursor-pointer m-1 rounded-md px-3 py-2
                        hover:bg-accent text-sm text-foreground
                        ${isSelected ? 'bg-accent text-accent-foreground font-medium' : ''}
                      `}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <svg
                          className="h-4 w-4 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
