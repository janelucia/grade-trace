<template>
  <input
      type="file"
      accept=".xlsx, .csv"
      ref="fileInput"
      @change="handleFileUpload"
      class="hidden"
      id="upload"
  />

  <label
      for="upload"
      class="btn sm:btn-lg btn-accent w-full flex items-center justify-between px-4"
  >
    <span class="flex-shrink-0">📁</span>
    <span class="absolute left-1/2 transform -translate-x-1/2">Upload file</span>
  </label>

  <Teleport to="body">
    <div v-if="showToast" class="toast toast-top toast-end fixed z-[9999] m-4">
      <div class="alert text-wrap" :class="alertColor">
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </Teleport>

  <div class="mt-4">
    <h3 class="font-bold mb-2">Uploaded Files</h3>
    <ul>
      <li v-for="file in uploadedFiles" :key="file.name" class="text-sm">
        📄 {{ file.name }} — last uploaded at {{ file.uploadedAt.toLocaleString() }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { utils, read } from 'xlsx'
import { useMarks } from '~/composables/useMarks'
import { useUploadedFiles } from '~/composables/useUploadedFiles'

const emit = defineEmits(['upload-complete'])

const showToast = ref(false)
const toastMessage = ref('')
const alertColor = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const { uploadedFiles } = useUploadedFiles()
const { savedMarks, addMark } = useMarks()

const isValidMarkRow = (row: any) => {
  const hasRequiredFields =
      typeof row.moduleName === 'string' &&
      row.moduleName.trim().length > 0 &&
      !isNaN(Number(row.ects)) &&
      !isNaN(Number(row.semester)) &&
      !isNaN(Number(row.percentage)) &&
      !isNaN(Number(row.mark))

  const valuesAreInRange =
      Number(row.ects) > 0 &&
      Number(row.percentage) >= 0 &&
      Number(row.percentage) <= 100 &&
      Number(row.mark) >= 0 &&
      Number(row.mark) <= 5

  return hasRequiredFields && valuesAreInRange
}

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const data = await file.arrayBuffer()
  const workbook = read(data)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const json = utils.sheet_to_json(worksheet)

  let addedCount = 0
  let updatedCount = 0
  let duplicateCount = 0
  let invalidCount = 0

  json.forEach((row: any) => {
    if (!isValidMarkRow(row)) {
      invalidCount++
      return
    }

    const index = savedMarks.value.findIndex(
        (m) =>
            m.moduleName.toLowerCase().trim() === row.moduleName?.toLowerCase().trim()
    )

    const newMark = {
      moduleName: row.moduleName.trim(),
      ects: Number(row.ects),
      semester: Number(row.semester),
      percentage: Number(row.percentage),
      mark: Number(row.mark),
    }

    if (index !== -1) {
      const existing = savedMarks.value[index]

      const isChanged =
          existing.ects !== newMark.ects ||
          existing.semester !== newMark.semester ||
          existing.percentage !== newMark.percentage ||
          existing.mark !== newMark.mark

      if (isChanged) {
        savedMarks.value[index] = { ...existing, ...newMark }
        updatedCount++
      } else {
        duplicateCount++
      }
    } else {
      addMark(newMark)
      addedCount++
    }
  })

  const existingFile = uploadedFiles.value.find(f => f.name === file.name)
  if (existingFile) {
    existingFile.uploadedAt = new Date()
  } else {
    uploadedFiles.value.push({
      name: file.name,
      uploadedAt: new Date(),
    })
  }

  const fileSummary = []
  if (addedCount > 0) fileSummary.push(`${addedCount} neu`)
  if (updatedCount > 0) fileSummary.push(`${updatedCount} aktualisiert`)
  if (duplicateCount > 0) fileSummary.push(`${duplicateCount} Duplikate`)
  if (invalidCount > 0) fileSummary.push(`${invalidCount} ungültig`)

  toastMessage.value = `Datei "${file.name}" verarbeitet: ${fileSummary.join(', ')}.`
  alertColor.value = addedCount > 0 || updatedCount > 0 ? 'alert-success' : 'alert-warning'
  emit('upload-complete')

  showToast.value = true
  setTimeout(() => (showToast.value = false), 3000)

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

onMounted(() => {
  const stored = localStorage.getItem('uploadedFiles')
  if (stored) {
    const parsed = JSON.parse(stored)
    uploadedFiles.value = parsed.map((file: any) => ({
      name: file.name,
      uploadedAt: new Date(file.uploadedAt),
    }))
  }
})

watch(uploadedFiles, (newVal) => {
  localStorage.setItem('uploadedFiles', JSON.stringify(newVal))
}, { deep: true })
</script>
