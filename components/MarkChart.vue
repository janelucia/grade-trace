<template>
  <div class="w-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps<{
  marks: { semester: number; moduleName: string; mark: number }[];
  isHigherMarkBetter: boolean;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const yAxisMin = computed(() => {
  if (props.marks.length === 0) return 0;
  return props.isHigherMarkBetter
      ? Math.min(...props.marks.map((m) => m.mark)) - 1
      : Math.min(0, Math.min(...props.marks.map((m) => m.mark)) - 1);
});

const yAxisMax = computed(() => {
  if (props.marks.length === 0) return 10;
  return props.isHigherMarkBetter
      ? Math.max(...props.marks.map((m) => m.mark)) + 1
      : Math.max(...props.marks.map((m) => m.mark)) + 1;
});

const createChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const sortedMarks = [...props.marks].sort((a, b) => a.semester - b.semester);

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: sortedMarks.map((mark) => `Semester ${mark.semester}`),
      datasets: [
        {
          label: 'Marks Progression',
          data: sortedMarks.map((mark) => mark.mark),
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
            text: 'Mark',
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
watch(() => [props.marks, props.isHigherMarkBetter], createChart, { deep: true });
</script>
