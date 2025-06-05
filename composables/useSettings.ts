import { ref, reactive, watch } from 'vue'

const isHigherMarkBetter = ref(true)
const totalSemesters = ref(7)
totalSemesters.value = 7
const totalEcts = ref(180)
const ownPrediction = ref(0)

export function useSettings() {
    const settings = reactive({
        isHigherMarkBetter,
        totalSemesters,
        totalEcts,
        ownPrediction,
    })

    // Load from localStorage on first call
    if (import.meta.client) {
        const saved = localStorage.getItem('gradeSettings')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                Object.assign(settings, parsed)
            } catch {
                console.error('Failed to parse grade settings from localStorage')
            }
        }

        // Save on change
        watch(settings, () => {
            localStorage.setItem('gradeSettings', JSON.stringify(settings))
        }, { deep: true })
    }

    return settings
}
