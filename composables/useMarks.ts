import { ref } from 'vue'
import type { Mark } from '~/types/types'

const savedMarks = ref<Mark[]>([])

export function useMarks() {
    const loadMarks = () => {
        savedMarks.value = JSON.parse(localStorage.getItem('marks') || '[]')
    }

    const persistMarks = () => {
        localStorage.setItem('marks', JSON.stringify(savedMarks.value))
    }

    const addMark = (mark: Mark) => {
        savedMarks.value.push(mark)
        persistMarks()
    }

    return {
        savedMarks,
        loadMarks,
        persistMarks,
        addMark
    }
}
