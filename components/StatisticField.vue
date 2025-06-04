<template>
  <div class="p-4 w-40 h-full border-4 border-primary rounded-lg flex flex-col justify-between items-center text-center">
    <p v-if="icon">{{icon}}</p>
    <div class="text-2xl">
      <slot/>
    </div>
    <div class="text-sm text-base-content/50">{{description}}</div>
  </div>
</template>
<script setup lang="ts">
  defineProps<{
    description: string;
    icon?: string;
  }>();
</script>