<template>
    <div class="flex flex-col gap-4 sm:gap-6">
      <div class="flex items-center gap-2">
        <label class="w-full">Is a higher mark better?</label>
        <input type="checkbox" v-model="settings.isHigherMarkBetter" class="toggle toggle-primary" />
      </div>
      <div class="flex items-center gap-2">
        <label class="w-full">Total Number of Semesters</label>
        <input type="number" v-model.number="settings.totalSemesters" class="input input-sm w-32 text-right px-6" />
      </div>
      <div class="flex items-center gap-2">
        <label class="w-full">Total ECTS Credits</label>
        <input type="number" v-model.number="settings.totalEcts" class="input input-sm w-32 text-right px-6" />
      </div>
      <div v-if="!onboarding" class="flex items-center gap-2">
        <label class="w-full">Set own Prediction (optional)</label>
        <input type="number" v-model.number="settings.ownPrediction" class="input input-sm w-32 text-right px-6" />
        <Button v-if="settings.ownPrediction > 0" @click="settings.ownPrediction = 0" class="btn-secondary btn-sm">Reset</Button>
      </div>
    </div>
</template>
<script setup lang="ts">
import { useSettings } from '~/composables/useSettings'

defineProps<{
  onboarding?: boolean
}>()

const settings = useSettings()
</script>
