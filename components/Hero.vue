<template>
  <div class="w-full flex flex-col gap-8">
    <div class="w-full flex items-center">
      <div class="w-full flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
        <div class="w-full h-full flex flex-col gap-4 sm:gap-8 py-8 sm:py-0">
          <div class="flex flex-col gap-2">
            <p class="text-2xl">Your Journey,</p>
            <p class="text-2xl">Your Progress.</p>
          </div>
          <h2 class="text-4xl font-bold">Make a mark today!</h2>
          <div class="flex gap-2 items-center justify-center sm:justify-start flex-wrap">
            <AddModal button-class="btn-lg" id="hero-modal" />
            <UploadModal id="file_upload_hero"/>
          </div>
        </div>
        <div class="flex flex-col gap-2w-full items-end">
          <NuxtImg class="w-full h-full object-cover rounded-lg" src="img/hero-pic.png" alt="Hero Image" />
          <div class="tooltip hover:tooltip-open tooltip-left tooltip-info absolute" data-tip="This image is AI generated.">
            <button class="btn btn-info">i</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
