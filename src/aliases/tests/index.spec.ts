import path from 'path'
import { isLiteral, isPrimitive, aliases } from '../index'
import { Project } from 'ts-morph'

describe('isPrimitive', () => {
  it('returns true if type is primitive', () => {
    const project = new Project()
    const file = project.addSourceFileAtPath(path.join(__dirname, 'Mixed.ts'))
    const type = file.getTypeAliases()[1].getTypeNodeOrThrow().getType()

    expect(isPrimitive(type)).toBeTruthy()
  })
  
  it('returns true if type is literal', () => {
    const project = new Project()
    const file = project.addSourceFileAtPath(path.join(__dirname, 'Mixed.ts'))
    const type = file.getTypeAliases()[0].getTypeNodeOrThrow().getType()

    expect(isPrimitive(type)).toBeTruthy()
  })

  it('returns false if type is not primitive nor literal', () => {
    const project = new Project()
    const file = project.addSourceFileAtPath(path.join(__dirname, 'NotPrimitive.ts'))
    const type = file.getTypeAliases()[0].getTypeNodeOrThrow().getType()

    expect(isPrimitive(type)).toBeFalsy()
  })
})

describe('isLiteral', () => {
  it('returns false if type is primitive', () => {
    const project = new Project()
    const file = project.addSourceFileAtPath(path.join(__dirname, 'Mixed.ts'))
    const type = file.getTypeAliases()[1].getTypeNodeOrThrow().getType()

    expect(isLiteral(type)).toBeFalsy()
  })
  
  it('returns true if type is literal', () => {
    const project = new Project()
    const file = project.addSourceFileAtPath(path.join(__dirname, 'Mixed.ts'))
    const type = file.getTypeAliases()[0].getTypeNodeOrThrow().getType()

    expect(isLiteral(type)).toBeTruthy()
  })

  it('returns false if type is not primitive nor literal', () => {
    const project = new Project()
    const file = project.addSourceFileAtPath(path.join(__dirname, 'NotPrimitive.ts'))
    const type = file.getTypeAliases()[0].getTypeNodeOrThrow().getType()

    expect(isLiteral(type)).toBeFalsy()
  })
})

describe('generation', () => {  
  describe('aliases', () => {
    it('generates aliases types to zod matchers', () => {
      const project = new Project()
      const file = project.addSourceFileAtPath(path.join(__dirname, 'Primitives.ts')).getSourceFile()

      const output = aliases(
        file,
        'zod'
      )

      expect(output).toMatchSnapshot()
    })
  })

  describe('literals', () => {
    it('generates aliases types to zod matchers', () => {
      const project = new Project()
      const file = project.addSourceFileAtPath(path.join(__dirname, 'Literals.ts')).getSourceFile()

      const output = aliases(
        file,
        'zod'
      )

      expect(output).toMatchSnapshot()
    })
  })

  describe('mixed aliases and literals', () => {
    it('generates aliases and literal types to zod matchers', () => {
      const project = new Project()
      const file = project.addSourceFileAtPath(path.join(__dirname, 'Mixed.ts')).getSourceFile()

      const output = aliases(
        file,
        'zod'
      )

      expect(output).toMatchSnapshot()
    })
  })
})
