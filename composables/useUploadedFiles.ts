import { ref, watch, onMounted } from 'vue'

const uploadedFiles = ref<{ name: string; uploadedAt: Date }[]>([])

export const useUploadedFiles = () => {
  onMounted(() => {
    const stored = localStorage.getItem('uploadedFiles')
    if (stored) {
      const parsed = JSON.parse(stored)
      uploadedFiles.value = parsed.map((file: any) => ({
        name: file.name,
        uploadedAt: new Date(file.uploadedAt),
      }))
    }
  })

  watch(uploadedFiles, (newVal) => {
    localStorage.setItem('uploadedFiles', JSON.stringify(newVal))
  }, { deep: true })

  return {
    uploadedFiles
  }
}
