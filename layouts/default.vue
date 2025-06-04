<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 w-full z-10">
      <div class="navbar bg-base-100 shadow-sm">
        <!-- Logo on the left -->
        <div class="navbar-start">
          <NuxtLink to="/" class="flex items-center gap-2">
            <NuxtImg src="./img/logo.png" alt="Logo" class="w-20 sm:w-32 ml-2" />
          </NuxtLink>
        </div>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex navbar-center">
          <ul class="menu menu-horizontal px-1">
            <li v-if="isHome"><a href="#statistics" class="btn btn-ghost btn-lg">Statistics</a></li>
            <li v-if="isHome"><a href="#saved-marks" class="btn btn-ghost btn-lg">Saved Marks</a></li>
            <li v-if="isInformation"><NuxtLink to="/" class="btn btn-ghost btn-lg">Home</NuxtLink></li>
            <li v-if="isHome"><NuxtLink to="/information" class="btn btn-ghost btn-lg">Information</NuxtLink></li>
          </ul>
        </div>

        <!-- Right side: Desktop Buttons & Mobile Dropdown -->
        <div class="navbar-end gap-2">
          <!-- Desktop Buttons -->
          <div class="hidden lg:flex gap-4">
            <UploadModal id="file_upload_header" />
            <AddModal id="header-modal" />
          </div>

          <!-- Mobile Dropdown -->
          <div class="relative lg:hidden">
            <!-- Toggle Button -->
            <button @click="dropdownOpen = !dropdownOpen" class="btn btn-ghost btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <ul
                v-show="dropdownOpen"
                class="absolute right-0 mt-3 w-56 p-2 gap-4 z-10 menu menu-sm dropdown-content bg-base-100 rounded-box shadow">
              <li v-if="isHome"><a href="#statistics" class="text-lg py-2" @click="dropdownOpen = false">Statistics</a></li>
              <li v-if="isHome"><a href="#saved-marks" class="text-lg py-2" @click="dropdownOpen = false">Saved Marks</a></li>
              <li v-if="isInformation"><NuxtLink to="/" class="text-lg py-2" @click="dropdownOpen = false">Home</NuxtLink></li>
              <li v-if="isHome"><NuxtLink to="/information" class="text-lg py-2" @click="dropdownOpen = false">Information</NuxtLink></li>
              <li><UploadModal id="file_upload_header_mobile" btn-class="w-full" /></li>
              <li><AddModal id="header-modal-mobile" btn-class="w-full" /></li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 p-4 flex flex-col gap-8 sm:gap-16 w-full relative">
      <slot />
    </main>

    <footer class="p-4 w-full flex justify-center items-center gap-4">
      <div class="flex">
        <p>Made with ❤️ by</p>
        <a href="https://github.com/janelucia" class="link link-neutral pl-1" target="_blank">Jane</a>
      </div>
      <a href="https://github.com/janelucia/remark" class="link link-neutral flex items-center" target="_blank">
        <Icon name="octicon:mark-github-16" />
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isHome = computed(() => route.path === '/')
const isInformation = computed(() => route.path === '/information')

const dropdownOpen = ref(false)

watch(() => route.path, () => {
  dropdownOpen.value = false
})
</script>
