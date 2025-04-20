<template>
  <div class="w-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import type { MarksPerSemester } from '~/types/types';

Chart.register(...registerables);

const props = defineProps<{
  marksPerSemester: MarksPerSemester[];
  isHigherMarkBetter: boolean;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const sortedData = [...props.marksPerSemester].sort((a, b) => a.semester - b.semester);
  const values = sortedData.map((entry) => entry.average);

  if (values.length === 0) return;

  const minY = Math.min(...values) - 1;
  const maxY = Math.max(...values) + 1;

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: sortedData.map((entry) => entry.semester),
      datasets: [
        {
          label: 'Average Mark per Semester',
          data: values,
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
          min: minY,
          max: maxY,
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

onMounted(createChart);
watch(
    () => [props.marksPerSemester, props.isHigherMarkBetter],
    createChart,
    { deep: true }
);
</script>
