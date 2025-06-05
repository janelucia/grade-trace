<template>
  <h3 class="text-xl font-semibold">File Upload</h3>
  <p class="py-4">Upload a file which adheres to the specifics of the template.</p>
  <div class="flex flex-col gap-4">
    <ExcelUpload  @upload-complete="$emit('upload-complete')" />
    <Button class="btn w-full relative flex items-center justify-between px-4" @click="downloadTemplate">
      <span class="flex-shrink-0">📥</span>
      <span class="absolute left-1/2 transform -translate-x-1/2">
            Download Excel Template
          </span>
    </Button>
  </div>
</template>
<script setup lang="ts">
import { utils, write } from 'xlsx'

defineEmits<{
  (e: 'upload-complete'): void
}>()

const templateData = [
  {
    moduleName: 'Example Module',
    ects: 7.5,
    semester: 1,
    percentage: 95,
    mark: 1.3,
  }
]

const downloadTemplate = () => {
  const worksheet = utils.json_to_sheet(templateData)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Marks Template')

  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' })

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'marks-template.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>