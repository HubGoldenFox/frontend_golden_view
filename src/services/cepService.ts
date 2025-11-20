// services/cepService.ts
export interface ViaCEPResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

export const buscaCEP = async (cep: string): Promise<ViaCEPResponse | null> => {
  try {
    // Remove qualquer caractere não numérico
    const cepNumerico = cep.replace(/\D/g, '')

    // Verifica se o CEP tem 8 dígitos
    if (cepNumerico.length !== 8) {
      return null
    }

    const response = await fetch(
      `https://viacep.com.br/ws/${cepNumerico}/json/`
    )

    if (!response.ok) {
      throw new Error('Erro na requisição do CEP')
    }

    const data: ViaCEPResponse = await response.json()

    // Se o ViaCEP retornar erro, retorna null
    if (data.erro) {
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    return null
  }
}
