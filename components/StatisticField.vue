<template>
  <div class="p-4 w-40 h-20 border-4 border-primary rounded-lg flex flex-col justify-center items-center text-center">
    <div class="text-2xl">{{ Number(displayedNumber).toFixed(2) }}</div>
    <div class="text-sm text-base-content/50">{{description}}</div>
  </div>
</template>
<script setup lang="ts">
  defineProps<{
    displayedNumber: string | number;
    description: string;
  }>();
</script>