<script setup lang="ts">
import { ref } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type { SearchParams, SearchBarEmits } from '../types/search'

const emit = defineEmits<SearchBarEmits>()

const destination = ref('')
// SPEC-GAP: Date | null used locally for unselected state; asserted to Date on emit since validation guarantees both dates are present
const dateRange = ref<Date[] | null>(null)
const guests = ref(1)

const errors = ref({ destination: '', dates: '' })

function decreaseGuests() {
  if (guests.value > 1) guests.value--
}

function increaseGuests() {
  guests.value++
}

function validate(): boolean {
  errors.value = { destination: '', dates: '' }
  let valid = true

  if (!destination.value.trim()) {
    errors.value.destination = 'Please enter a destination'
    valid = false
  }

  if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
    errors.value.dates = 'Please select your dates'
    valid = false
  } else if (dateRange.value[1] <= dateRange.value[0]) {
    errors.value.dates = 'Check-out must be after check-in'
    valid = false
  }

  if (guests.value < 1) guests.value = 1

  return valid
}

function handleSubmit() {
  if (!validate()) return

  emit('search', {
    destination: destination.value.trim(),
    startDate: dateRange.value![0] as Date,
    endDate: dateRange.value![1] as Date,
    guests: guests.value,
  } satisfies SearchParams)
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="flex flex-col lg:flex-row lg:items-end gap-3 rounded-full bg-surface px-6 py-2 shadow-lg"
  >
    <div class="flex flex-col gap-1 flex-1 border-r border-neutral-300 pr-0 lg:pr-4">
      <label for="destination" class="text-xs font-medium text-neutral-800">Destination</label>
      <input
        id="destination"
        v-model="destination"
        type="text"
        placeholder="Where are you going?"
        class="w-full rounded-md text-neutral-900 py-1 focus:outline-primary outline-offset-2 text-sm bg-surface placeholder:text-neutral-500 transition-[border-color,box-shadow] duration-base ease-out"
        data-testid="destination-input"
      />
      <p
        v-if="errors.destination"
        class="text-sm text-error-500"
        data-testid="destination-error"
      >
        {{ errors.destination }}
      </p>
    </div>

    <div class="flex flex-col gap-1 flex-1 border-r border-neutral-300 pr-0 lg:pr-4">
      <label class="text-xs font-medium text-neutral-800">Dates</label>
      <VueDatePicker v-model="dateRange" range />
      <p
        v-if="errors.dates"
        class="text-sm text-error-500"
        data-testid="dates-error"
      >
        {{ errors.dates }}
      </p>
    </div>

    <div class="flex flex-col gap-1 pr-0 lg:pr-4">
      <label class="text-xs font-medium text-neutral-800 mb-1">Guests</label>
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="decreaseGuests"
          :disabled="guests === 1"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-base font-medium text-text disabled:cursor-not-allowed disabled:opacity-40"
          data-testid="guests-decrease"
        >
          -
        </button>
        <span class="w-6 text-center text-sm font-medium text-text" data-testid="guests-value">
          {{ guests }}
        </span>
        <button
          type="button"
          @click="increaseGuests"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-base font-medium text-text"
          data-testid="guests-increase"
        >
          +
        </button>
      </div>
    </div>

    <button
      type="submit"
      class="inline-flex w-12 h-12 items-center justify-center flex-shrink-0 rounded-full bg-primary text-sm font-medium text-white transition-[background-color,box-shadow] duration-base ease-out hover:bg-primary-600 focus-visible:outline-none focus-visible:shadow-glow"
      data-testid="submit"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>
    </button>
  </form>
</template>
