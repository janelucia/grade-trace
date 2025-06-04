<template>
  <Button class="w-fit" :class="btnClass" @click="openModal">
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
      <h3 class="text-xl font-semibold">File Upload</h3>
      <p class="py-4">Upload a file which adheres to the specifics of the template.</p>
      <div class="flex flex-col gap-4">
        <ExcelUpload @upload-complete="modal.close()" />
        <Button class="btn w-full relative flex items-center justify-between px-4" @click="downloadTemplate">
          <span class="flex-shrink-0">📥</span>
          <span class="absolute left-1/2 transform -translate-x-1/2">
            Download Excel Template
          </span>
        </Button>
      </div>
      <div class="modal-action mt-4!">
        <form method="dialog" class="w-full">
          <Button class="btn-secondary w-full">Close</Button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { utils, write } from 'xlsx'

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