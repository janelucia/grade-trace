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
      <UploadDialogContent @upload-complete="modal.value?.close()" />
      <div class="modal-action mt-4!">
        <form method="dialog" class="w-full">
          <Button class="btn-secondary w-full">Close</Button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">

defineProps<{
  id: string;
  btnClass?: string;
}>()

const modal = ref(null)

const openModal = () => {
  modal.value?.showModal()
}



</script>