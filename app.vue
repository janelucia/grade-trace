<template>
  <div class="p-4 flex flex-col gap-8 w-full">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl">ReMark</h1>
      <p class="text-lg">Add a new mark and see how you progressed in your studies :D</p>

      <fieldset class="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box">
        <legend class="fieldset-legend">Add mark</legend>

        <label class="fieldset-label">Module name</label>
        <input v-model="moduleName" type="text" class="input" placeholder="eg: Math 1" />

        <label class="fieldset-label">ECTS</label>
        <input v-model.number="ects" type="number" class="input" placeholder="eg: 7.5" />

        <label class="fieldset-label">Semester</label>
        <input v-model.number="semester" type="number" class="input" placeholder="eg: 1" />

        <label class="fieldset-label">Percentage</label>
        <input v-model.number="percentage" type="number" class="input" placeholder="eg: 80" />

        <label class="fieldset-label">Mark</label>
        <input v-model.number="mark" type="number" class="input" placeholder="eg: 2.0" />

        <button @click="saveMark" class="btn btn-primary mt-4">Add mark</button>
      </fieldset>
    </div>

    <div v-if="sortedMarks.length > 0">
      <h2 class="text-2xl">Statistics</h2>
      <div class="w-full flex flex-col gap-4 items-center">
        <div class="stats stats-vertical shadow">
        <div class="stat place-items-center">
          <div class="stat-title">Average Mark</div>
          <div class="stat-value">{{ (calculateAverage("mark") / sortedMarks.length).toFixed(2) }}</div>
        </div>

        <div class="stat place-items-center">
          <div class="stat-title">Average Percentage</div>
          <div class="stat-value text-secondary">
            {{ (calculateAverage("percentage")/ sortedMarks.length).toFixed(2) }}%
          </div>
        </div>

        <div class="stat place-items-center">
          <div class="stat-title">Total ECTS</div>
          <div class="stat-value">{{ (calculateAverage("ects")) }} ECTS</div>
        </div>
      </div>

      <div>
        <h2 class="text-2xl">Marks Progression Over Semesters</h2>

        <div class="flex items-center gap-2">
          <label class="font-bold">Is a higher mark better?</label>
          <input type="checkbox" v-model="isHigherMarkBetter" class="toggle toggle-primary" />
        </div>

        <div class="h-80">
          <MarkChart :marks="sortedMarks" :isHigherMarkBetter="isHigherMarkBetter" />
        </div>
      </div>
      </div>

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
          <tr v-for="(mark, index) in sortedMarks" :key="index">
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
</template>

<script setup lang="ts">

const moduleName = ref('');
const ects = ref<number | null>(null);
const semester = ref<number | null>(null);
const percentage = ref<number | null>(null);
const mark = ref<number | null>(null);
const isHigherMarkBetter = ref(true);

const savedMarks = ref<{ moduleName: string; ects: number; semester: number; percentage: number; mark: number }[]>([]);

const editingIndex = ref<number | null>(null);
const editableMark = ref({ moduleName: '', ects: 0, semester: 0, percentage: 0, mark: 0 });

const sortedMarks = computed(() => {
  return [...savedMarks.value].sort((a, b) => a.semester - b.semester);
});

const calculateAverage = (key: 'mark' | 'percentage' | 'ects') => {
  return sortedMarks.value.length
      ? parseFloat((sortedMarks.value.reduce((acc, mark) => acc + mark[key], 0) / sortedMarks.value.length).toFixed(2))
      : 0;
};

const saveMark = () => {
  if (!moduleName.value || ects.value === null || semester.value === null || percentage.value === null || mark.value === null) {
    alert('Please fill in all fields.');
    return;
  }

  const newMark = { moduleName: moduleName.value, ects: ects.value, semester: semester.value, percentage: percentage.value, mark: mark.value };
  savedMarks.value.push(newMark);
  localStorage.setItem('marks', JSON.stringify(savedMarks.value));

  moduleName.value = '';
  ects.value = null;
  semester.value = null;
  percentage.value = null;
  mark.value = null;
};

const deleteMark = (index: number) => {
  savedMarks.value.splice(index, 1);
  localStorage.setItem('marks', JSON.stringify(savedMarks.value));
};

const editMark = (index: number) => {
  editingIndex.value = index;
  editableMark.value = { ...savedMarks.value[index] };
};

const saveEditedMark = (index: number) => {
  savedMarks.value[index] = { ...editableMark.value };
  localStorage.setItem('marks', JSON.stringify(savedMarks.value));
  editingIndex.value = null;
};

onMounted(() => {
  savedMarks.value = JSON.parse(localStorage.getItem('marks') || '[]');
  const storedPreference = localStorage.getItem('isHigherMarkBetter');
  if (storedPreference !== null) isHigherMarkBetter.value = JSON.parse(storedPreference);
});
</script>