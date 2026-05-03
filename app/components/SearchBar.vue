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
    class="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-md"
  >
    <div class="flex flex-col gap-1">
      <label for="destination" class="text-sm font-medium text-gray-700">Destination</label>
      <input
        id="destination"
        v-model="destination"
        type="text"
        placeholder="Where are you going?"
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-testid="destination-input"
      />
      <p
        v-if="errors.destination"
        class="text-sm text-red-600"
        data-testid="destination-error"
      >
        {{ errors.destination }}
      </p>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700">Dates</label>
      <VueDatePicker v-model="dateRange" range />
      <p
        v-if="errors.dates"
        class="text-sm text-red-600"
        data-testid="dates-error"
      >
        {{ errors.dates }}
      </p>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700">Guests</label>
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="decreaseGuests"
          :disabled="guests === 1"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg font-medium disabled:cursor-not-allowed disabled:opacity-40"
          data-testid="guests-decrease"
        >
          -
        </button>
        <span class="w-6 text-center text-sm font-medium" data-testid="guests-value">
          {{ guests }}
        </span>
        <button
          type="button"
          @click="increaseGuests"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg font-medium"
          data-testid="guests-increase"
        >
          +
        </button>
      </div>
    </div>

    <button
      type="submit"
      class="w-full rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
      data-testid="submit"
    >
      Search
    </button>
  </form>
</template>
