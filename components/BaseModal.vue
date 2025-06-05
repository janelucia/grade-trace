<template>
  <teleport to="body">
    <dialog ref="modalRef" :id="id" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <slot />
        <div v-if="showClose" class="modal-action mt-4">
          <form method="dialog" class="w-full">
            <Button class="btn-secondary w-full">Close</Button>
          </form>
        </div>
      </div>
    </dialog>
  </teleport>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  showClose?: boolean;
}>()

const modalRef = ref<HTMLDialogElement | null>(null)

const open = () => {
  modalRef.value?.showModal()
}

const close = () => {
  modalRef.value?.close()
}

defineExpose({ open, close })
</script>
