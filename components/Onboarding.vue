<template>
  <BaseModal ref="modalRef" v-if="show" :id="'onboarding-modal'" :persistent="true">
  <div class="flex flex-col gap-6">
      <!-- Logo at the top -->
      <div class="flex flex-col items-center gap-2">
        <NuxtImg format="webp" src="./img/logo.png" alt="Grade Trace Logo" class="h-12" />
      </div>

      <template v-if="step === 1">
        <div class="flex flex-col gap-2">
          <h2 class="text-2xl font-bold">Welcome 👋</h2>
          <p class="text-base-content/80">
            This app helps you track, analyze, and project your academic performance.
          </p>
        </div>
        <ul class="list-disc list-inside space-y-1 text-base-content/70">
          <li>
            Add modules with both percentage and grade, along with their ECTS.
            <p class="text-sm text-base-content/60 pl-8 py-2">
              Note: The percentage provides a more detailed view of your performance.
              For example, a 1.0 grade covers anything from 95% to 100% in the German grading system.
            </p>
          </li>
          <li>Get automatic average and grade predictions.</li>
          <li>Visualize your academic journey semester by semester.</li>
        </ul>
        <div class="flex justify-end gap-4">
          <Button @click="finish" class="btn-secondary">Start</Button>
          <Button @click="step++" class="btn-primary self-end">Next</Button>
        </div>
      </template>

      <template v-else-if="step === 2">
        <div class="flex flex-col gap-4">
          <h2 class="text-xl font-semibold">Setup your preferences ⚙️</h2>
          <SettingsPanel onboarding />
        </div>
        <div class="flex justify-end gap-4">
          <Button @click="step--" class="btn-outline">Back</Button>
          <Button @click="step++" class="btn-primary self-end">Next</Button>
        </div>
      </template>

      <template v-else-if="step === 3">
        <div class="flex flex-col gap-4">
          <h2 class="text-xl font-semibold">Upload your Marks </h2>
          <p class="text-base-content/80">
            To skip this step and add marks later, click "Start" below. Otherwise, upload your Marks now.
          </p>
          <UploadDialogContent />
        </div>
        <div class="flex justify-end gap-4">
          <Button @click="step--" class="btn-outline">Back</Button>
          <Button @click="finish" class="btn-primary">Start</Button>
        </div>
      </template>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import SettingsPanel from '~/components/SettingsPanel.vue'
import BaseModal from '~/components/BaseModal.vue'
import { useMarks } from '~/composables/useMarks'

const { hasMarks, loadMarks } = useMarks()
const step = ref(1)
const show = ref(false)

const modalRef = ref<InstanceType<typeof BaseModal> | null>(null)

const finish = () => {
  localStorage.setItem('onboardingShown', 'true')
  show.value = false
}

onMounted(() => {
  loadMarks()
  const alreadyShown = localStorage.getItem('onboardingShown')
  if (!alreadyShown && !hasMarks.value) {
    show.value = true
  } else if(!alreadyShown && hasMarks.value) {
    finish()
  }
})

watch(show, (newVal) => {
  if (newVal) {
    nextTick(() => {
      modalRef.value?.open()
    })
  }
})
</script>

