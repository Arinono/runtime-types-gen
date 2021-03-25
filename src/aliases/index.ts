import { SourceFile, Type } from "ts-morph";
import { GeneratorType } from "..";

export const isPrimitive = (type: Type): boolean => {
  return (type.isString() || type.isStringLiteral()) ||
    (type.isNumber() || type.isNumberLiteral()) ||
    (type.isBoolean() || type.isBooleanLiteral()) ||
    type.isUndefined() ||
    type.isNull() ||
    type.isAny() ||
    type.isUnknown()
}

export const isLiteral = (type: Type): boolean => {
  if (isPrimitive(type)) {
    return type.isStringLiteral() ||
      type.isNumberLiteral() ||
      type.isBooleanLiteral()
  }
  return false
}

// Doesn't handle Enum nor EnumLiteral
const getTypeFromDeclaration = (type: Type): { 
  type: 'literal' | 'primitive',
  value: string
} => {
  if (type.isNullable()) {
    return getTypeFromDeclaration(type.getNonNullableType())
  }
  if (type.isString() || type.isStringLiteral()) {
    return type.isStringLiteral() ? 
      { type: 'literal', value: `${type.getText()}` } : 
      { type: 'primitive', value: 'string' }
  } else if (type.isNumber() || type.isNumberLiteral()) {
    return type.isNumberLiteral() ? 
      { type: 'literal', value: type.getText() } : 
      { type: 'primitive', value: 'number' }
  } else if (type.isBoolean() || type.isBooleanLiteral()) {
    return type.isBooleanLiteral() ? 
      { type: 'literal', value: type.getText() } : 
      { type: 'primitive', value: 'boolean' }
  } else if (type.isUndefined()) {
    return { type: 'primitive', value: 'undefined' }
  } else if (type.isNull()) {
    return { type: 'primitive', value: 'null' }
  } else if (type.isAny()) {
    return { type: 'primitive', value: 'any' }
  } else if (type.isUnknown()) {
    return { type: 'primitive', value: 'unknown' }
  }
  return { type: 'primitive', value: 'void' }
}

const zodPrimitives = (file: SourceFile): string => {
  const primitives = file.getTypeAliases().map(t => {
    const typeNode = t.getTypeNodeOrThrow()
  
    return {
      name: t.getName(),
      pType: getTypeFromDeclaration(typeNode.getType()) 
    }
  })

  return `import * as z from 'zod'

${primitives.map(p => `const ${p.name} = z.${p.pType.type === 'literal' ? 
  `literal(${p.pType.value})` : 
  `${p.pType.value}()`}`).join('\n')}`
}

export const aliases = (file: SourceFile, gen: GeneratorType): string => {
  switch (gen) {
    case 'zod':
      return zodPrimitives(file)
  }
}
