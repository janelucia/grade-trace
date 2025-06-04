<template>
  <div class="w-full min-h-[300px]">
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

  const values = props.marksPerSemester
      .map((entry) => entry.average)
      .filter((v): v is number => v !== undefined);

  if (values.length === 0) return;

  const minY = Math.min(...values) - 1;
  const maxY = Math.max(...values) + 1;

  const actual = props.marksPerSemester
      .filter(m => typeof m.average === 'number')
      .map(m => ({ x: m.semester, y: m.average! }));

  const lastActual = actual.at(-1);

  const best = props.marksPerSemester
      .filter(m => typeof m.best === 'number')
      .map(m => ({ x: m.semester, y: m.best! }));

  const worst = props.marksPerSemester
      .filter(m => typeof m.worst === 'number')
      .map(m => ({ x: m.semester, y: m.worst! }));

  const predicted = props.marksPerSemester
      .filter(m => typeof m.predicted === 'number')
      .map(m => ({ x: m.semester, y: m.predicted! }));

  if (lastActual) {
    best.unshift({ x: lastActual.x, y: lastActual.y });
    worst.unshift({ x: lastActual.x, y: lastActual.y });
    if (predicted.length > 0) {
      predicted.unshift({ x: lastActual.x, y: lastActual.y });
    }
  }


  const datasets = [
    {
      label:  'Average ' + ((worst.length > 1) ? 'cumulated' : '/ Semester' ),
      data: actual,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
    }
  ];

  if (worst.length > 1) {
    datasets.push({
      label: 'Worst Case',
      data: worst,
      borderColor: 'red',
      borderDash: [10, 5],
      borderWidth: 2,
      fill: false,
      tension: 0,
    },
    {
      label: 'Best Case',
      data: best,
      borderColor: 'green',
      borderDash: [10, 5],
      borderWidth: 2,
      fill: false,
      tension: 0,
    });
  }

  console.log(predicted);

  if (predicted.length > 0) {
    datasets.push({
      label: "Own Prognose",
      data: predicted,
      borderColor: "orange",
      borderDash: [2, 2],
      tension: 0.3,
    })
  }


  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      datasets: datasets
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
          type: 'linear',
          title: {
            display: true,
            text: 'Semester',
          },
          ticks: {
            stepSize: 1,
            precision: 0,
          }
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
