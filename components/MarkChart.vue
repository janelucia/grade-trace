<template>
  <div class="w-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import type { MarksPerSemester } from '~/types/types';

Chart.register(...registerables);

const props = defineProps<{
  marksPerSemester: MarksPerSemester[];
  isHigherMarkBetter: boolean;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

// Compute dynamic Y-axis min and max
const yAxisMin = computed(() => {
  if (props.marksPerSemester.length === 0) return 0;
  const values = props.marksPerSemester.map((m) => m.average);
  return props.isHigherMarkBetter
      ? Math.min(...values) - 1
      : Math.min(0, Math.min(...values) - 1);
});

const yAxisMax = computed(() => {
  if (props.marksPerSemester.length === 0) return 10;
  const values = props.marksPerSemester.map((m) => m.average);
  return props.isHigherMarkBetter
      ? Math.max(...values) + 1
      : Math.max(...values) + 1;
});

const createChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const sortedData = [...props.marksPerSemester].sort((a, b) => a.semester - b.semester);

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: sortedData.map((entry) => entry.semester),
      datasets: [
        {
          label: 'Average Mark per Semester',
          data: sortedData.map((entry) => entry.average),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          min: yAxisMin.value,
          max: yAxisMax.value,
          reverse: !props.isHigherMarkBetter,
          title: {
            display: true,
            text: 'Average Mark',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Semester',
          },
        },
      },
    },
  });
};

// Watch for prop changes and rebuild the chart
onMounted(createChart);
watch(
    () => [props.marksPerSemester, props.isHigherMarkBetter],
    createChart,
    { deep: true }
);
</script>
