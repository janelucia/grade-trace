<template>
  <Button class="btn-primary w-fit" :class="btnClass" @click="openModal">
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
            d="M12 4v16m8-8H4"
        />
      </svg>
      <span class="hidden sm:inline">
       Add a
      </span>
    <span>
       Mark
      </span>
    </Button>

  <BaseModal ref="modal" :id="id">
    <h3 class="text-xl font-semibold mb-4">Add a Mark</h3>

    <div class="flex flex-col gap-6">
      <div class="flex flex-col sm:flex-row gap-6">
        <div class="flex flex-col gap-4 w-full">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Module name</span>
            </label>
            <input v-model="moduleName" type="text" class="input input-bordered w-full" placeholder="e.g. Math 1" />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">ECTS</span>
            </label>
            <input v-model.number="ects" type="number" class="input input-bordered w-full" placeholder="e.g. 7.5" />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Semester</span>
            </label>
            <input v-model.number="semester" type="number" class="input input-bordered w-full" placeholder="e.g. 1" />
          </div>
        </div>
        <div class="flex flex-col gap-4 w-full">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Percentage</span>
            </label>
            <input v-model.number="percentage" type="number" class="input input-bordered w-full" placeholder="e.g. 80" />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Mark</span>
            </label>
            <input v-model.number="mark" type="number" class="input input-bordered w-full" placeholder="e.g. 2.0" />
          </div>
        </div>
      </div>
      <div class="modal-action flex flex-col gap-2">
        <Button @click="saveMark(false)" class="btn-primary w-full">Save and add another</Button>
        <Button @click="saveMark(true)" class="btn-secondary w-full">Save and close</Button>

        <form method="dialog" class="w-full">
          <Button class="w-full">Close without saving</Button>
        </form>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useMarks } from '~/composables/useMarks'
import BaseModal from "~/components/BaseModal.vue";

defineProps<{
  btnClass?: string;
  id: string;
}>();

const { addMark } = useMarks()

const moduleName = ref('');
const ects = ref<number | null>(null);
const semester = ref<number | null>(null);
const percentage = ref<number | null>(null);
const mark = ref<number | null>(null);

const modal = ref<InstanceType<typeof BaseModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}

const saveMark = (withClose: boolean) => {
  if (!moduleName.value || ects.value === null || semester.value === null || percentage.value === null || mark.value === null) {
    alert('Please fill in all fields.');
    return;
  }

  addMark({
    moduleName: moduleName.value,
    ects: ects.value!,
    semester: semester.value!,
    percentage: percentage.value!,
    mark: mark.value!,
  })


  moduleName.value = '';
  ects.value = null;
  semester.value = null;
  percentage.value = null;
  mark.value = null;

  if (withClose) {
    modal?.value?.close()
  }
};

</script>
