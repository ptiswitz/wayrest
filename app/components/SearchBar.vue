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
    class="flex flex-col gap-4 rounded-xl bg-surface p-6 shadow-lg"
  >
    <div class="flex flex-col gap-1">
      <label for="destination" class="text-sm font-medium text-neutral-800">Destination</label>
      <input
        id="destination"
        v-model="destination"
        type="text"
        placeholder="Where are you going?"
        class="w-full rounded-md border border-border-strong px-4 h-11 text-base bg-surface text-text placeholder:text-neutral-400 hover:border-neutral-500 focus:outline-none focus:border-primary focus:shadow-glow transition-[border-color,box-shadow] duration-base ease-out"
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

    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-neutral-800">Dates</label>
      <div class="rounded-md border border-border overflow-hidden">
        <VueDatePicker v-model="dateRange" range />
      </div>
      <p
        v-if="errors.dates"
        class="text-sm text-error-500"
        data-testid="dates-error"
      >
        {{ errors.dates }}
      </p>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-neutral-800">Guests</label>
      <div class="flex items-center gap-3">
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
      class="inline-flex items-center justify-center w-full rounded-md bg-primary px-5 h-10 text-sm font-medium text-white transition-[background-color,box-shadow] duration-base ease-out hover:bg-primary-600 focus-visible:outline-none focus-visible:shadow-glow sm:w-auto"
      data-testid="submit"
    >
      Search
    </button>
  </form>
</template>
