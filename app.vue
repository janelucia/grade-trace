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

    <div class="stats stats-vertical shadow">
      <h2 class="text-2xl">Statistics</h2>
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
      <h2 class="text-2xl mb-2">Saved Marks</h2>

      <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table class="table">
          <thead>
          <tr>
            <th>Semester</th>

            <th>Module Name</th>
            <th>ECTS</th>
            <th>%</th>
            <th>Mark</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(mark, index) in sortedMarks" :key="index">
            <td>{{ mark.semester }}</td>
            <td>{{ mark.moduleName }}</td>
            <td>{{ mark.ects }}</td>
            <td>{{ mark.percentage }}%</td>
            <td>{{ mark.mark }}</td>
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

const savedMarks = ref<{ moduleName: string; ects: number; semester: number; percentage: number; mark: number }[]>([]);

const sortedMarks = computed(() => {
  return [...savedMarks.value].sort((a, b) => a.semester - b.semester);
});

const calculateAverage = (key: 'mark' | 'percentage' | 'ects') => {
  return parseFloat((sortedMarks.value.reduce((acc, mark) => acc + mark[key], 0) / sortedMarks.value.length).toFixed(2));
};

const saveMark = () => {
  if (!moduleName.value || ects.value === null || semester.value === null || percentage.value === null || mark.value === null) {
    alert('Please fill in all fields.');
    return;
  }

  if (moduleName.value === sortedMarks.value.find((m) => m.moduleName === moduleName.value)?.moduleName) {
    alert('Module name already exists.');
    return;
  }

  const newMark = {
    moduleName: moduleName.value,
    ects: ects.value,
    semester: semester.value,
    percentage: percentage.value,
    mark: mark.value,
  };

  const existingMarks = JSON.parse(localStorage.getItem('marks') || '[]');

  existingMarks.push(newMark);
  localStorage.setItem('marks', JSON.stringify(existingMarks));

  savedMarks.value = existingMarks;

  moduleName.value = '';
  ects.value = null;
  semester.value = null;
  percentage.value = null;
  mark.value = null;
};

onMounted(() => {
  savedMarks.value = JSON.parse(localStorage.getItem('marks') || '[]');
});
</script>
