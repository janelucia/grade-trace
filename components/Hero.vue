<template>
  <div class="w-full flex flex-col gap-8">
    <div class="w-full flex items-center">
      <div class="w-full flex flex-col-reverse sm:flex-row justify-between items-center gap-16 sm:gap-32">
        <div class="w-full h-full flex flex-col gap-8 sm:gap-16 sm:py-0">
          <div class="flex flex-col gap-2">
            <p class="text-2xl">Your Journey,</p>
            <p class="text-2xl">Your Progress.</p>
          </div>
          <h2 class="text-4xl font-bold">Make a mark today!</h2>
          <div class="flex gap-2 items-center justify-center sm:justify-start flex-wrap">
            <AddModal id="hero-modal" btn-class="w-full sm:w-fit" />
            <UploadModal id="file_upload_hero" btn-class="w-full sm:w-fit"/>
          </div>
        </div>
        <div class="flex flex-col gap-2 w-full items-end">
          <NuxtImg format="webp" class="w-full h-full object-cover rounded-lg" src="img/hero-pic.png" alt="Hero Image" />
        </div>
      </div>
    </div>
  </div>
</template>
