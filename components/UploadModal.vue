<template>
  <Button :class="btnClass" @click="openModal">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
      <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12"
      />
    </svg>
    <span class="hidden sm:inline">
      Upload your
    </span>
    <span>
      Marks
    </span>
  </Button>
  <dialog ref="modal" :id="id" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="font-bold text-lg">File Upload</h3>
      <p class="py-4">Upload a file which adheres to the specifics of the template.</p>
      <div class="flex flex-col gap-4">
        <ExcelUpload />
        <Button class="btn-accent" @click="downloadTemplate">
          Download Excel Template
        </Button>
      </div>
      <div class="modal-action mt-4!">
        <form method="dialog" class="w-full">
          <Button class="btn-secondary">Close</Button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'

defineProps<{
  id: string;
  btnClass?: string;
}>()

const modal = ref(null)

const openModal = () => {
  modal.value?.showModal()
}

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
  const worksheet = XLSX.utils.json_to_sheet(templateData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Marks Template')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'marks-template.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>