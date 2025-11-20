// patch-sdk.mjs
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_DIR = __dirname

/**
 * Encontra todos os arquivos que correspondem aos caminhos possíveis
 * @param {string} baseDir - Diretório base
 * @param {string[][]} possiblePaths - Array de arrays com possíveis caminhos
 * @returns {string[]} Array de caminhos completos encontrados
 */
function findAllMatchingFiles(baseDir, possiblePaths) {
  const found = []
  for (const pathParts of possiblePaths) {
    const filePath = path.resolve(baseDir, ...pathParts)
    if (fs.existsSync(filePath)) {
      found.push(filePath)
    }
  }
  return found
}

// Configuração dos arquivos a serem modificados
const FILES_CONFIG = {
  CLIENT: {
    possiblePaths: [
      ['client', 'client.gen.ts'],
      ['src', 'client', 'client.gen.ts'],
    ],
    required: true, // Indica se o arquivo é obrigatório
  },
  ANOTHER: {
    possiblePaths: [
      ['some', 'other', 'otherFile.ts'],
      ['src', 'some', 'other', 'otherFile.ts'],
      ['components', 'otherFile.ts'],
    ],
    required: false,
  },
  OPTIONAL_FILE: {
    possiblePaths: [
      ['optional', 'file.ts'],
      ['src', 'optional', 'file.ts'],
    ],
    required: false,
  },
}

// Objeto para armazenar os caminhos encontrados
const foundPaths = {}

try {
  // Verifica todos os arquivos
  let allRequiredFilesFound = true

  for (const [fileKey, config] of Object.entries(FILES_CONFIG)) {
    const found = findAllMatchingFiles(BASE_DIR, config.possiblePaths)

    if (found.length > 0) {
      foundPaths[fileKey] = found
      console.log(`✓ ${fileKey} encontrado em ${found.length} local(is):`)
      found.forEach((p) => console.log(`  - ${path.relative(BASE_DIR, p)}`))
    } else if (config.required) {
      allRequiredFilesFound = false
      const triedPaths = config.possiblePaths
        .map((p) => path.join(...p))
        .join('\n  - ')
      console.error(
        `❌ ${fileKey} não encontrado em nenhum dos locais:\n  - ${triedPaths}`
      )
    } else {
      console.log(`⚠️ ${fileKey} (opcional) não encontrado, será ignorado`)
    }
  }

  if (!allRequiredFilesFound) {
    throw new Error('Um ou mais arquivos obrigatórios não foram encontrados')
  }
} catch (err) {
  console.error('\n❌ Erro:', err.message)
  console.error('Abortando a execução sem modificar nenhum arquivo')
  process.exit(1)
}

function readFileSafe(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function writeFileSafe(filePath, content) {
  fs.writeFileSync(filePath, content)
  console.log('  ✅ Modificado:', path.relative(BASE_DIR, filePath))
}

function updateBaseURL() {
  if (!foundPaths.CLIENT || foundPaths.CLIENT.length === 0) return

  console.log('\nAtualizando baseURL em arquivos client...')

  foundPaths.CLIENT.forEach((filePath) => {
    let content = readFileSafe(filePath)
    const baseURLRegex = /baseURL:\s*(['"])(.*?)\1,?/

    if (baseURLRegex.test(content)) {
      content = content.replace(
        baseURLRegex,
        `baseURL: process.env.NEXT_PUBLIC_API_URL,`
      )
      writeFileSafe(filePath, content)
    } else {
      console.log(
        `  ⚠️ baseURL não encontrado em: ${path.relative(BASE_DIR, filePath)}`
      )
    }
  })
}

function updateOtherFile() {
  if (!foundPaths.ANOTHER || foundPaths.ANOTHER.length === 0) return

  console.log('\nAtualizando outros arquivos...')

  foundPaths.ANOTHER.forEach((filePath) => {
    let content = readFileSafe(filePath)
    // ... faça alterações no conteúdo
    writeFileSafe(filePath, content)
  })
}

function updateOptionalFile() {
  if (!foundPaths.OPTIONAL_FILE || foundPaths.OPTIONAL_FILE.length === 0) {
    console.log('\nNenhum arquivo opcional encontrado para modificar')
    return
  }

  console.log('\nAtualizando arquivos opcionais...')

  foundPaths.OPTIONAL_FILE.forEach((filePath) => {
    let content = readFileSafe(filePath)
    // ... faça alterações no conteúdo
    writeFileSafe(filePath, content)
  })
}

function main() {
  updateBaseURL()

  console.log('\n✅ Concluído!')
}

main()
