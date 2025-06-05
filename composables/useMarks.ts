import { ref, computed, watch } from 'vue'
import type { Mark } from '~/types/types'

const savedMarks = ref<Mark[]>([])

export function useMarks() {
    const loadMarks = () => {
        const raw = localStorage.getItem('marks')
        try {
            savedMarks.value = raw ? JSON.parse(raw) : []
        } catch {
            savedMarks.value = []
        }
    }

    const persistMarks = () => {
        localStorage.setItem('marks', JSON.stringify(savedMarks.value))
    }

    const addMark = (mark: Mark) => {
        savedMarks.value.push(mark)
        persistMarks()
    }

    const hasMarks = computed(() => savedMarks.value.length > 0)

    const removeMark = (index: number) => {
        savedMarks.value.splice(index, 1)
        persistMarks()
    }

    const clearMarks = () => {
        savedMarks.value = []
        persistMarks()
    }

    const updateMark = (index: number, newMark: Mark) => {
        savedMarks.value[index] = newMark
        persistMarks()
    }

    const sortedMarks = computed(() => {
        return [...savedMarks.value].toSorted((a, b) => a.semester - b.semester);
    });

    if (import.meta.client) {
        watch(savedMarks, persistMarks, { deep: true })
    }

    return {
        savedMarks,
        sortedMarks,
        hasMarks,
        loadMarks,
        persistMarks,
        addMark,
        removeMark,
        clearMarks,
        updateMark
    }
}
