import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ListingCard from './ListingCard.vue'
import type { Listing } from '../types/listing'

const base: Listing = {
  id: 1,
  title: 'Beautiful apartment in the city centre',
  city: 'Montreal',
  country: 'Canada',
  pricePerNight: 125,
  imageUrl: 'https://example.com/photo.jpg',
}

describe('ListingCard', () => {
  it('happy path: renders image, title, location and price correctly', () => {
    const wrapper = mount(ListingCard, { props: { listing: base } })

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe(base.imageUrl)
    expect(wrapper.text()).toContain(base.title)
    expect(wrapper.text()).toContain('Montreal, Canada')
    expect(wrapper.text()).toContain('125 $ / night')
  })

  it('truncation: title element has line-clamp-2 class', () => {
    const listing = { ...base, title: 'A'.repeat(300) }
    const wrapper = mount(ListingCard, { props: { listing } })

    expect(wrapper.find('[data-testid="title"]').classes()).toContain('line-clamp-2')
  })

  it('placeholder: null imageUrl renders placeholder instead of img', () => {
    const wrapper = mount(ListingCard, { props: { listing: { ...base, imageUrl: null } } })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('[data-testid="placeholder"]').exists()).toBe(true)
  })

  it('placeholder: broken imageUrl renders placeholder after error event', async () => {
    const wrapper = mount(ListingCard, { props: { listing: base } })
    expect(wrapper.find('img').exists()).toBe(true)

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('[data-testid="placeholder"]').exists()).toBe(true)
  })

  it('price format: displays "125 $ / night"', () => {
    const wrapper = mount(ListingCard, { props: { listing: base } })

    expect(wrapper.text()).toContain('125 $ / night')
  })

  it('location format: displays "Montreal, Canada"', () => {
    const wrapper = mount(ListingCard, { props: { listing: base } })

    expect(wrapper.text()).toContain('Montreal, Canada')
  })
})
