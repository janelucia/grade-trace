<template>
  <div class="flex flex-col lg:flex-row items-center justify-between gap-12 px-4 py-8">
    <!-- Text Section -->
    <div class="flex-1 max-w-xl space-y-6">
      <div class="space-y-2">
        <h1 class="text-3xl sm:text-4xl font-bold">💡 Information</h1>
        <p class="text-lg text-gray-600">Everything you need to know about privacy, visuals, and the project.</p>
      </div>

      <div class="space-y-4">
        <div>
          <h2 class="text-xl font-semibold">🔒 Your Data, Your Privacy</h2>
          <p class="text-base leading-relaxed">
            Everything you enter stays on your device.<br>
            Nothing is uploaded or tracked — your marks are stored <strong>100% locally</strong>.
          </p>
        </div>

        <div>
          <h2 class="text-xl font-semibold">🧠 AI-Generated Illustrations</h2>
          <p class="text-base leading-relaxed">
            The visuals and logos in GradeTrace were created using AI tools to give the app a modern and personal feel.
          </p>
        </div>

        <div>
          <h2 class="text-xl font-semibold">💻 Made with care & curiosity</h2>
          <p class="text-base leading-relaxed">
            GradeTrace is open source! You can find the code on
            <a href="https://github.com/janelucia/grade-trace" target="_blank" class="underline text-primary-content">GitHub</a>.
          </p>
        </div>
      </div>
    </div>

    <!-- Image Section -->
    <div class="flex-1 max-w-lg">
      <NuxtImg src="/img/information-picture.png" alt="Privacy illustration" class="w-full rounded-xl" />
    </div>
  </div>
</template>
