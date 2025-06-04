<template>
    <Hero />
    <!-- Statistics Section -->
    <section id="statistics"  class="scroll-mt-24">
      <div v-if="sortedMarks.length > 0" class="w-full flex justify-between flex-wrap sm:flex-nowrap">
        <div class="w-full flex flex-col gap-4 sm:gap-8">
          <div class="flex justify-between items-center gap-4 sm:gap-8">
            <h2 class="text-2xl">Statistics</h2>
            <Button class="btn-primary btn-dash w-fit" @click="openModal">
              ⚙️
            </Button>
            <dialog class="modal modal-bottom sm:modal-middle w-full" ref="settingsModal" id="settingsModal">
              <div class="flex flex-col gap-4 sm:gap-8 w-full sm:w-2/3 bg-base-100 p-4 rounded-box">
                <h3 class="text-xl font-semibold">Settings</h3>
                <p>
                  Provide the total number of semesters and ECTS credits in your program to improve the accuracy of the grade projection.
                </p>
                <div class="flex flex-col gap-4 sm:gap-8">
                  <div class="flex items-center sm:items-start gap-2">
                    <label class="w-full">Is a higher mark better?</label>
                    <input type="checkbox" v-model="isHigherMarkBetter" class="toggle toggle-primary" />
                  </div>
                  <div class="flex items-center sm:items-start gap-2">
                    <label class="w-full">Total Number of Semesters</label>
                    <input type="number" v-model.number="totalSemesters" class="input input-sm w-32 text-right px-6" />
                  </div>
                  <div class="flex items-center sm:items-start gap-2">
                    <label class="w-full">Total ECTS Credits</label>
                    <input type="number" v-model.number="totalEcts" class="input input-sm w-32 text-right px-6" />
                  </div>
                  <div class="flex items-center sm:items-start gap-2">
                    <label class="w-full">Set own Prediction</label>
                    <input type="number" v-model.number="ownPrediction" class="input input-sm w-32 text-right px-6" />
                    <Button v-if="ownPrediction > 0" class="btn-primary w-fit" @click="ownPrediction = 0">Reset</Button>
                  </div>
                </div>
                <div class="modal-action">
                  <Button @click="settingsModal?.close()" class="btn-secondary w-full">Close</Button>
                </div>
              </div>
            </dialog>
          </div>
          <div class="flex gap-4 sm:gap-8 justify-center sm:justify-between items-center flex-wrap">
            <StatisticField icon="Ø" description="Current Average">
              {{ calculateAverage('mark').toFixed(2) }} / {{calculateAverage('percentage').toFixed(2)}} %
            </StatisticField>
            <StatisticField icon="📈" description="Best Prediction">
              {{ cumulativeAverageWithProjection.at(-1)?.best?.toFixed(2) || 'N/A' }}
            </StatisticField>
            <StatisticField icon="📉" description="Worst Prediction">
              {{ cumulativeAverageWithProjection.at(-1)?.worst?.toFixed(2) || 'N/A' }}
            </StatisticField>
            <StatisticField icon="✅" description="Completed ECTS">
              {{calculateTotal('ects')}}
            </StatisticField>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div class="flex flex-col gap-2 sm:w-1/2 justify-between">
              <h3 class="text-lg">Average Marks per Semester</h3>
              <MarkChart :marks-per-semester="averageMarksPerSemester" :isHigherMarkBetter="isHigherMarkBetter" />
            </div>
            <div class="flex flex-col gap-2 sm:w-1/2">
              <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg">Average Marks over the Semesters + Future</h3>
              </div>
              <MarkChart :marks-per-semester="cumulativeAverageWithProjection" :isHigherMarkBetter="isHigherMarkBetter" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Saved Marks Section -->
    <section id="saved-marks"  class="scroll-mt-24">
      <div v-if="sortedMarks.length > 0">
        <div class="flex flex-col gap-4 sm:gap-8">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl">Saved Marks</h2>
            <Button class="btn-secondary w-fit!" @click="deleteAllMarks">Delete all Marks</Button>
          </div>
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
                    <Button v-if="editingIndex === index" @click="saveEditedMark(index)" class="btn-success btn-md">Save</Button>
                    <Button v-else @click="editMark(index)" class="btn-info btn-md"><Icon name="material-symbols:edit-outline"/></Button>
                    <Button @click="deleteMark(index)" class="btn-error btn-md"><Icon name="mdi:trash-can-outline"/></Button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
</template>

<script setup lang="ts">
import type {Mark, MarksPerSemester} from "~/types/types";
import { useMarks } from '~/composables/useMarks'

const { savedMarks, loadMarks } = useMarks()

const isHigherMarkBetter = ref(true);
const totalSemesters = ref(7);
const totalEcts = ref(185);
const ownPrediction = ref(0);
const settingsModal = ref(null);

const editingIndex = ref<number | null>(null);
const editableMark = ref<Mark>({ moduleName: '', ects: 0, semester: 0, percentage: 0, mark: 0 });

const openModal = () => {
  settingsModal.value?.showModal();
}

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

const deleteAllMarks = () => {
  savedMarks.value = [];
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

const cumulativeAverageWithProjection = computed(() => {
  const grouped: Record<number, { mark: number; ects: number }[]> = {};
  savedMarks.value.forEach(({ semester, mark, ects }) => {
    if (!grouped[semester]) grouped[semester] = [];
    grouped[semester].push({ mark, ects });
  });

  const sortedSemesters = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);

  const result: MarksPerSemester[] = [];

  let weightedSum = 0;
  let completedEcts = 0;

  for (const semester of sortedSemesters) {
    const entries = grouped[semester];
    for (const entry of entries) {
      weightedSum += entry.mark * entry.ects;
      completedEcts += entry.ects;
    }

    result.push({
      semester,
      average: Number((weightedSum / completedEcts).toFixed(2)),
    });
  }

  const remainingEcts = totalEcts.value - completedEcts;
  const remainingSemesters = totalSemesters.value - (sortedSemesters.at(-1) ?? 0);
  const futureSemesters = Array.from({ length: remainingSemesters }, (_, i) => (sortedSemesters.at(-1) ?? 0) + i + 1);
  const baseEcts = Math.floor(remainingEcts / remainingSemesters);
  const leftover = remainingEcts % remainingSemesters;

  const ectsDistribution = futureSemesters.map((_, i) =>
      i < leftover ? baseEcts + 1 : baseEcts
  );

  let bestSum = weightedSum;
  let worstSum = weightedSum;
  let predictedSum = weightedSum;
  let runningEcts = completedEcts;

  for (let i = 0; i < futureSemesters.length; i++) {
    const semester = futureSemesters[i];
    const ects = ectsDistribution[i];

    runningEcts += ects;
    bestSum += (isHigherMarkBetter.value ? 5.0 : 1.0) * ects;
    worstSum += (isHigherMarkBetter.value ? 1.0 : 4.0) * ects;
    predictedSum += ownPrediction.value * ects;


    result.push({
      semester,
      best: Number((bestSum / runningEcts).toFixed(2)),
      worst: Number((worstSum / runningEcts).toFixed(2)),
      predicted: (ownPrediction.value > 0) ? Number((predictedSum / runningEcts).toFixed(2)) : undefined,
    });
  }

  return result;
});


watch(isHigherMarkBetter, () => {
  localStorage.setItem('isHigherMarkBetter', JSON.stringify(isHigherMarkBetter.value));
})

watch(totalSemesters, () => {
  localStorage.setItem('totalSemesters', JSON.stringify(totalSemesters.value));
})
watch(totalEcts, () => {
  localStorage.setItem('totalEcts', JSON.stringify(totalEcts.value));
})

const storedPreference = () => {
  const higherMarkPref = localStorage.getItem('isHigherMarkBetter');
  const semestersPref = localStorage.getItem('totalSemesters');
  const ectsPref = localStorage.getItem('totalEcts');
  const ownPredictionPref = localStorage.getItem('ownPrediction');
  if (higherMarkPref !== null) isHigherMarkBetter.value = JSON.parse(higherMarkPref);
  if (semestersPref !== null) totalSemesters.value = JSON.parse(semestersPref);
  if (ectsPref !== null) totalEcts.value = JSON.parse(ectsPref);
  if (ownPredictionPref !== null) ownPrediction.value = JSON.parse(ownPredictionPref);
};

onMounted(() => {
  loadMarks();
  storedPreference();
});
</script>
