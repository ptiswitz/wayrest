import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SearchBar from './SearchBar.vue'

vi.mock('@vuepic/vue-datepicker', async () => {
  const { h } = await import('vue')
  return {
    VueDatePicker: {
      name: 'VueDatePicker',
      props: ['modelValue', 'range'],
      emits: ['update:modelValue'],
      setup() {
        return () => h('div', { 'data-testid': 'date-picker' })
      },
    },
  }
})

async function setDates(wrapper: ReturnType<typeof mount>, start: Date, end: Date) {
  const picker = wrapper.findComponent({ name: 'VueDatePicker' })
  picker.vm.$emit('update:modelValue', [start, end])
  await nextTick()
}

describe('SearchBar', () => {
  it('happy path: valid form emits search event with correct SearchParams', async () => {
    const wrapper = mount(SearchBar)
    const start = new Date('2024-06-01')
    const end = new Date('2024-06-07')

    await wrapper.find('[data-testid="destination-input"]').setValue('Paris')
    await setDates(wrapper, start, end)
    await wrapper.find('form').trigger('submit')

    const emitted = wrapper.emitted('search')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toEqual({ destination: 'Paris', startDate: start, endDate: end, guests: 1 })
  })

  it('validation: empty destination shows error message', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('[data-testid="destination-error"]').text()).toBe('Please enter a destination')
  })

  it('validation: missing dates shows error message', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.find('[data-testid="destination-input"]').setValue('Paris')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('[data-testid="dates-error"]').text()).toBe('Please select your dates')
  })

  it('validation: endDate before startDate shows error message', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.find('[data-testid="destination-input"]').setValue('Paris')
    await setDates(wrapper, new Date('2024-06-07'), new Date('2024-06-01'))
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('[data-testid="dates-error"]').text()).toBe('Check-out must be after check-in')
  })

  it('guests: minus button is disabled when guests equals 1', () => {
    const wrapper = mount(SearchBar)
    const btn = wrapper.find('[data-testid="guests-decrease"]').element as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('guests: plus button increases guests count', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.find('[data-testid="guests-increase"]').trigger('click')
    expect(wrapper.find('[data-testid="guests-value"]').text().trim()).toBe('2')
  })

  it('guests: minus button decreases guests count', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.find('[data-testid="guests-increase"]').trigger('click')
    await wrapper.find('[data-testid="guests-decrease"]').trigger('click')
    expect(wrapper.find('[data-testid="guests-value"]').text().trim()).toBe('1')
  })
})
