<template>
  <button class="btn btn-primary" :class="buttonClass" @click="openModal">
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
    </button>

  <dialog ref="modal" :id=id class="modal modal-bottom sm:modal-middle">
    <div class="flex flex-col gap-2 w-full sm:w-2/3">
      <fieldset class="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box">
        <legend class="fieldset-legend text-xl bg-base-200 rounded-lg p-0 px-2">Add a mark</legend>

        <div class="flex flex-col gap-4">

          <div class="flex flex-col sm:flex-row gap-4">

            <div class="flex flex-col gap-2 w-full">
              <label class="fieldset-label">Module name</label>
              <input v-model="moduleName" type="text" class="input w-full" placeholder="eg: Math 1" />

              <label class="fieldset-label">ECTS</label>
              <input v-model.number="ects" type="number" class="input w-full" placeholder="eg: 7.5" />

              <label class="fieldset-label">Semester</label>
              <input v-model.number="semester" type="number" class="input w-full" placeholder="eg: 1" />
            </div>

            <div class="flex flex-col gap-2 w-full">
              <label class="fieldset-label">Percentage</label>
              <input v-model.number="percentage" type="number" class="input w-full" placeholder="eg: 80" />

              <label class="fieldset-label">Mark</label>
              <input v-model.number="mark" type="number" class="input w-full" placeholder="eg: 2.0" />
            </div>

          </div>

          <div class="modal-action">
            <button @click="saveMark(false)" class="btn btn-primary">Save and add another</button>
            <button @click="saveMark(true)" class="btn btn-secondary">Save and close</button>
            <button @click="closeModal" class="btn">x</button>
          </div>
        </div>


      </fieldset>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useMarks } from '~/composables/useMarks'

const props = defineProps<{
  buttonClass?: string;
  id: string;
}>();

const { addMark } = useMarks()


const modal = ref(null)
const moduleName = ref('');
const ects = ref<number | null>(null);
const semester = ref<number | null>(null);
const percentage = ref<number | null>(null);
const mark = ref<number | null>(null);

const openModal = () => {
  modal.value?.showModal()
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
    closeModal()
  }
};

const closeModal = () => {
  const modal = document.getElementById(props.id) as HTMLDialogElement;
  modal.close();
}

</script>
