// utils/objectDiff.ts - Versão simplificada

export function getChangedPropertiesSimple<T extends Record<string, any>>(
  baseObject: T,
  newObject: Partial<T>
): Partial<T> {
  const changes: Partial<T> = {};

  for (const key in newObject) {
    if (Object.prototype.hasOwnProperty.call(newObject, key)) {
      const baseValue = baseObject[key];
      const newValue = newObject[key];

      // Comparação simples (sem deep comparison)
      if (JSON.stringify(baseValue) !== JSON.stringify(newValue)) {
        changes[key] = newValue;
      }
    }
  }

  return changes;
}

