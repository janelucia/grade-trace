<template>
  <input
      type="file"
      accept=".xlsx, .csv"
      ref="fileInput"
      @change="handleFileUpload"
      class="file-input file-input-bordered file-input-lg w-full"
  />

  <Teleport to="body">
    <div
        v-if="showToast"
        class="toast toast-top toast-end fixed z-[9999] m-4"
    >
      <div class="alert text-wrap" :class="alertColor">
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </Teleport>

  <div class="mt-4">
    <h3 class="font-bold mb-2">Uploaded Files</h3>
    <ul>
      <li
          v-for="file in uploadedFiles"
          :key="file.name"
          class="text-sm"
      >
        📄 {{ file.name }} — last uploaded at
        {{ file.uploadedAt.toLocaleString() }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { read, utils } from 'xlsx'
import { useMarks } from '~/composables/useMarks'
import { useUploadedFiles } from '~/composables/useUploadedFiles'

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
      Number(row.percentage) >= 0 && Number(row.percentage) <= 100 &&
      Number(row.mark) >= 1 && Number(row.mark) <= 5 // Adjust to your grading scale

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
  let duplicateCount = 0
  let invalidCount = 0

  json.forEach((row: any) => {
    const alreadyExists = savedMarks.value.some(
        (m) =>
            m.moduleName.toLowerCase().trim() ===
            row.moduleName?.toLowerCase().trim()
    )

    if (!isValidMarkRow(row)) {
      invalidCount++
    } else if (alreadyExists) {
      duplicateCount++
    } else {
      addMark({
        moduleName: row.moduleName.trim(),
        ects: Number(row.ects),
        semester: Number(row.semester),
        percentage: Number(row.percentage),
        mark: Number(row.mark),
      })
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

  if (addedCount > 0) {
    toastMessage.value = `File "${file.name}" processed. ${addedCount} new mark(s) added.` +
        (duplicateCount > 0 ? ` ${duplicateCount} duplicate(s) skipped.` : '') +
        (invalidCount > 0 ? ` ${invalidCount} invalid entr${invalidCount === 1 ? 'y' : 'ies'} skipped.` : '')
    alertColor.value = 'alert-success'
  } else if (duplicateCount > 0 || invalidCount > 0) {
    toastMessage.value = `File "${file.name}" processed. ${
        duplicateCount > 0 ? `${duplicateCount} duplicate(s)` : ''
    }${
        duplicateCount > 0 && invalidCount > 0 ? ' and ' : ''
    }${
        invalidCount > 0 ? `${invalidCount} invalid entr${invalidCount === 1 ? 'y' : 'ies'}` : ''
    } skipped.`
    alertColor.value = 'alert-warning'
  } else {
    toastMessage.value = `File "${file.name}" processed. No valid data found.`
    alertColor.value = 'alert-error'
  }

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
