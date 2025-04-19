<template>
  <Analytics />
  <header class="p-4 sticky top-0 w-full z-10 bg-base-100 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <NuxtImg src="./img/logo.png" alt="Logo" class="w-16 h-16" />
      <p class="p-0 font-bold hidden sm:inline-block">Semester<br/>Scoreboard</p>
    </div>
    <AddModal button-class="btn-lg" id="header-modal"/>
  </header>
  <main class="p-4 flex flex-col gap-8 w-full relative">
    <Hero
        :average-mark="(calculateAverage('mark') / sortedMarks.length).toFixed(2)"
        :average-percentage="(calculateAverage('percentage')/ sortedMarks.length).toFixed(2)"
        :total-ects="calculateAverage('ects')"
    >
        <div>
          <h2 class="text-2xl">Marks Progression Over Semesters</h2>

          <div class="flex items-center gap-2">
            <label class="font-bold">Is a higher mark better?</label>
            <input type="checkbox" v-model="isHigherMarkBetter" class="toggle toggle-primary" />
          </div>
            <MarkChart :marks-per-semester="averageMarksPerSemester" :isHigherMarkBetter="isHigherMarkBetter" />
        </div>
    </Hero>

    <div v-if="sortedMarks.length > 0">

      <div class="flex flex-col gap-4">
        <h2 class="text-2xl">Saved Marks</h2>
        <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table class="table">
            <thead>
            <tr>
              <th>Semester</th>
              <th>Module Name</th>
              <th>ECTS</th>
              <th>%</th>
              <th>Mark</th>
              <th>Adjust</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(mark, index) in savedMarks" :key="index">
              <td>
                <input v-if="editingIndex === index" v-model.number="editableMark.semester" type="number" class="input input-sm w-16" />
                <span v-else>{{ mark.semester }}</span>
              </td>
              <td>
                <input v-if="editingIndex === index" v-model="editableMark.moduleName" type="text" class="input input-sm" />
                <span v-else>{{ mark.moduleName }}</span>
              </td>
              <td>
                <input v-if="editingIndex === index" v-model.number="editableMark.ects" type="number" class="input input-sm w-16" />
                <span v-else>{{ mark.ects }}</span>
              </td>
              <td>
                <input v-if="editingIndex === index" v-model.number="editableMark.percentage" type="number" class="input input-sm w-16" />
                <span v-else>{{ mark.percentage }}%</span>
              </td>
              <td>
                <input v-if="editingIndex === index" v-model.number="editableMark.mark" type="number" class="input input-sm w-16" />
                <span v-else>{{ mark.mark }}</span>
              </td>
              <td>
                <div class="flex gap-2">
                  <button v-if="editingIndex === index" @click="saveEditedMark(index)" class="btn btn-success btn-md">Save</button>
                  <button v-else @click="editMark(index)" class="btn btn-info btn-md"><Icon name="material-symbols:edit-outline"/></button>
                  <button @click="deleteMark(index)" class="btn btn-error btn-md"><Icon name="mdi:trash-can-outline"/></button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
      </div>

      </div>
    </div>
  </main>
  <footer class="p-4 w-full flex justify-center">
    <p>Made with <3</p>
  </footer>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
import type {Mark} from "~/types/types";
import { useMarks } from '~/composables/useMarks'

const { savedMarks, loadMarks } = useMarks()

const isHigherMarkBetter = ref(true);

const editingIndex = ref<number | null>(null);
const editableMark = ref<Mark>({ moduleName: '', ects: 0, semester: 0, percentage: 0, mark: 0 });

const sortedMarks = computed(() => {
  return [...savedMarks.value].toSorted((a, b) => a.semester - b.semester);
});

const calculateTotal = (key: keyof Mark) =>
    savedMarks.value.reduce((acc, mark) => acc + Number(mark[key]), 0);

const calculateAverage = (key: keyof Mark) =>
    savedMarks.value.length ? calculateTotal(key) / savedMarks.value.length : 0;

const deleteMark = (index: number) => {
  savedMarks.value.splice(index, 1);
  persistMark();
};

const editMark = (index: number) => {
  editingIndex.value = index;
  editableMark.value = { ...savedMarks.value[index] };
};

const saveEditedMark = (index: number) => {
  savedMarks.value[index] = { ...editableMark.value };
  persistMark();
  editingIndex.value = null;
};

const persistMark = () => {
  localStorage.setItem('marks', JSON.stringify(savedMarks.value));
};

const averageMarksPerSemester = computed(() => {
  const grouped: Record<number, number[]> = {};

  savedMarks.value.forEach(({ semester, mark }) => {
    grouped[semester] = grouped[semester] || [];
    grouped[semester].push(mark);
  });

  return Object.entries(grouped).map(([semester, marks]) => ({
    semester: Number(semester),
    average: Number((marks.reduce((sum, m) => sum + m, 0) / marks.length).toFixed(2)),
  }));
});

watch(isHigherMarkBetter, () => {
  localStorage.setItem('isHigherMarkBetter', JSON.stringify(isHigherMarkBetter.value));
})

onMounted(() => {
  loadMarks();
  const storedPreference = localStorage.getItem('isHigherMarkBetter');
  if (storedPreference !== null) isHigherMarkBetter.value = JSON.parse(storedPreference);
});
</script>