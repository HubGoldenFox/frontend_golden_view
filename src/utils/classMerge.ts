type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | { [key: string]: boolean | null | undefined }

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []

  const processInput = (input: ClassValue) => {
    if (!input) return

    if (typeof input === 'string') {
      classes.push(input)
    } else if (typeof input === 'number') {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      input.forEach(processInput)
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) {
          classes.push(key)
        }
      }
    }
  }

  inputs.forEach(processInput)

  // Remove classes duplicadas e vazias
  return Array.from(new Set(classes.join(' ').split(' ').filter(Boolean)))
    .join(' ')
    .trim()
}
