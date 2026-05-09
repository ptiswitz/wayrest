<script setup lang="ts">
import { useRouter } from '#app'

const props = defineProps<{
  currentStep: 1 | 2 | 3
  slug: string
}>()

const router = useRouter()

const steps = [
  { n: 1 as const, label: 'Review', path: 'summary' },
  { n: 2 as const, label: 'Payment', path: 'payment' },
  { n: 3 as const, label: 'Confirmation', path: 'confirmation' },
]

function navigateToStep(step: 1 | 2 | 3) {
  if (step < props.currentStep) {
    router.push(`/booking/${props.slug}/${steps[step - 1].path}`)
  }
}
</script>

<template>
  <div class="bg-surface border-b border-border">
    <div class="max-w-5xl mx-auto px-6 py-5 flex items-center justify-center gap-4">
      <template v-for="(step, i) in steps" :key="step.n">
        <button
          type="button"
          class="flex items-center gap-3 text-sm font-medium"
          :class="[
            step.n === currentStep ? 'text-text' : 'text-text-subtle',
            step.n < currentStep ? 'cursor-pointer hover:text-text' : 'cursor-default',
          ]"
          :disabled="step.n >= currentStep"
          @click="navigateToStep(step.n)"
        >
          <span
            class="w-[26px] h-[26px] rounded-full border flex items-center justify-center text-xs"
            :class="{
              'bg-primary text-white border-primary': step.n === currentStep,
              'bg-secondary text-white border-secondary': step.n < currentStep,
              'bg-surface text-text-subtle border-border-strong': step.n > currentStep,
            }"
          >{{ step.n }}</span>
          {{ step.label }}
        </button>

        <div
          v-if="i < steps.length - 1"
          class="flex-shrink-0 w-14 h-px"
          :class="step.n < currentStep ? 'bg-secondary' : 'bg-border-strong'"
        />
      </template>
    </div>
  </div>
</template>
