<template>
    <Onboarding />
    <Hero />
    <!-- Statistics Section -->
    <section id="statistics"  class="scroll-mt-24">
      <div v-if="hasMarks" class="w-full flex justify-between flex-wrap sm:flex-nowrap">
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
                <SettingsPanel />
                <div class="modal-action">
                  <Button @click="settingsModal?.close()" class="btn-secondary w-full">Close</Button>
                </div>
              </div>
            </dialog>
          </div>
          <div class="flex gap-4 sm:gap-8 justify-center sm:justify-between items-center flex-wrap">
            <StatisticField description="Completed ECTS">
              <div
                  class="radial-progress text-accent"
                  :style="{ '--value': (totalCompletedEcts / settings.totalEcts * 100) }"
                  :aria-valuenow="totalCompletedEcts / settings.totalEcts * 100"
                  role="progressbar"
              >
                {{ ((totalCompletedEcts / settings.totalEcts) * 100).toFixed(0) }}%
              </div>
            </StatisticField>
            <StatisticField icon="Ø" description="Current Average">
              {{ currentAverage.toFixed(2) }} / {{ percentageAverage.toFixed(2) }} %
            </StatisticField>
            <StatisticField icon="📈" description="Best Prediction">
              {{ cumulativeAverageWithProjection.at(-1)?.best?.toFixed(2) || 'N/A' }}
            </StatisticField>
            <StatisticField icon="📉" description="Worst Prediction">
              {{ cumulativeAverageWithProjection.at(-1)?.worst?.toFixed(2) || 'N/A' }}
            </StatisticField>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div class="flex flex-col gap-2 sm:w-1/2 justify-between">
              <h3 class="text-lg">Average Marks per Semester</h3>
              <MarkChart :marks-per-semester="averageMarksPerSemester" :isHigherMarkBetter="settings.isHigherMarkBetter" />
            </div>
            <div class="flex flex-col gap-2 sm:w-1/2">
              <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg">Average Marks over the Semesters + Future</h3>
              </div>
              <MarkChart :marks-per-semester="cumulativeAverageWithProjection" :isHigherMarkBetter="settings.isHigherMarkBetter" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Saved Marks Section -->
    <section id="saved-marks"  class="scroll-mt-24">
      <div v-if="hasMarks">
        <div class="flex flex-col gap-4 sm:gap-8">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl">Saved Marks</h2>
            <Button class="btn-secondary w-fit!" @click="deleteAllMarks" aria-label="Delete mark">Delete all Marks</Button>
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
                    <Button v-if="editingIndex === index" @click="saveEdit(index)" class="btn-success btn-md">Save</Button>
                    <Button v-else @click="startEditing(index)" class="btn-info btn-md"><Icon name="material-symbols:edit-outline"/></Button>
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
import type {Mark} from "~/types/types";
import { useMarks } from '~/composables/useMarks'
import {
  calculateAverage,
  calculateTotal,
  getAverageMarksPerSemester,
  getCumulativeAverageWithProjection
} from "~/helpers/statistics";
import SettingsPanel from "~/components/SettingsPanel.vue";

const { savedMarks, loadMarks, removeMark, clearMarks, hasMarks, updateMark } = useMarks()

const settingsModal = ref(null);
const settings = reactive({
  isHigherMarkBetter: true,
  totalSemesters: 7,
  totalEcts: 185,
  ownPrediction: 0,
})


const editingIndex = ref<number | null>(null);
const editableMark = ref<Mark>({ moduleName: '', ects: 0, semester: 0, percentage: 0, mark: 0 });

const openModal = () => {
  settingsModal.value?.showModal();
}

const deleteMark = (index: number) => removeMark(index)
const deleteAllMarks = () => clearMarks()

const startEditing = (index: number) => {
  editingIndex.value = index;
  editableMark.value = { ...savedMarks.value[index] };
};

const saveEdit = (index: number) => {
  updateMark(index, { ...editableMark.value })
  editingIndex.value = null
}

const averageMarksPerSemester = computed(() =>
    getAverageMarksPerSemester(savedMarks.value)
)

const cumulativeAverageWithProjection = computed(() =>
    getCumulativeAverageWithProjection(
        savedMarks.value,
        settings
    )
)
const totalCompletedEcts = computed(() =>
    calculateTotal(savedMarks.value, 'ects')
)

const currentAverage = computed(() =>
    calculateAverage(savedMarks.value, 'mark')
)

const percentageAverage = computed(() =>
    calculateAverage(savedMarks.value, 'percentage')
)


watch(settings, () => {
  localStorage.setItem('gradeSettings', JSON.stringify(settings))
})

const storedPreference = () => {
  const stored = localStorage.getItem('gradeSettings')
  if (stored) Object.assign(settings, JSON.parse(stored))
};

onMounted(() => {
  loadMarks();
  storedPreference();
});
</script>
