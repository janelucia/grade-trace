<template>
  <div class="min-h-screen flex flex-col">
    <header class="p-4 sticky top-0 w-full z-10 bg-base-100 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <NuxtImg src="./img/logo.png" alt="Logo" class="w-16 h-16" />
        <p class="p-0 font-bold hidden sm:inline-block">Semester<br/>Scoreboard</p>
      </div>
      <div class="flex gap-2">
        <UploadModal id="file_upload_header"/>
        <AddModal id="header-modal"/>
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
