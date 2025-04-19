<template>
  <div class="w-full flex flex-col gap-8">
    <div class="w-full flex items-center">
      <div class="w-full flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
        <div class="w-full h-full flex flex-col gap-4 py-8 sm:py-0">
          <div class="flex flex-col gap-2">
            <p class="text-2xl">Your Journey,</p>
            <p class="text-2xl">Your Progress.</p>
          </div>
          <h2 class="text-4xl font-bold">Make a mark today!</h2>
          <AddModal button-class="btn-lg w-1/2 self-end sm:self-start" id="hero-modal" />
        </div>
        <div class="flex flex-col gap-2w-full items-end">
          <NuxtImg class="w-full h-full object-cover rounded-lg" src="img/hero-pic.png" alt="Hero Image" />
          <div class="tooltip hover:tooltip-open tooltip-left tooltip-info absolute" data-tip="This image is AI generated.">
            <button class="btn btn-info">i</button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-4 justify-evenly flex-wrap">
        <StatisticField :displayed-number="averageMark" description="Average Mark" />
        <StatisticField :displayed-number="averagePercentage" description="Average Percentage"/>
        <StatisticField :displayed-number="totalEcts" description="Total ECTS" />
    </div>
    <slot/>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    averageMark: string;
    averagePercentage: string;
    totalEcts: number;
  }>();
</script>