import { describe, it, expect } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it('generates correct slug from title and id', () => {
    expect(slugify('Chalet rustique Mont-Tremblant', 1)).toBe('chalet-rustique-mont-tremblant-1')
  })

  it('removes accents and diacritics', () => {
    expect(slugify('Château de Versailles', 42)).toBe('chateau-de-versailles-42')
  })

  it('collapses multiple spaces into a single dash', () => {
    expect(slugify('Beautiful  Home', 5)).toBe('beautiful-home-5')
  })

  it('appends the numeric id at the end', () => {
    expect(slugify('Studio', 99)).toBe('studio-99')
  })
})
