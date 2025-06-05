import type { Mark, MarksPerSemester, Settings } from '~/types/types'

export function calculateTotal(marks: Mark[], key: keyof Mark): number {
    return marks.reduce((acc, mark) => acc + Number(mark[key]), 0)
}

export function calculateAverage(marks: Mark[], key: keyof Mark): number {
    return marks.length ? calculateTotal(marks, key) / marks.length : 0
}

export function getAverageMarksPerSemester(marks: Mark[]): { semester: number, average: number }[] {
    const grouped: Record<number, number[]> = {}
    marks.forEach(({ semester, mark }) => {
        grouped[semester] = grouped[semester] || []
        grouped[semester].push(mark)
    })
    return Object.entries(grouped).map(([semester, marks]) => ({
        semester: Number(semester),
        average: Number((marks.reduce((sum, m) => sum + m, 0) / marks.length).toFixed(2))
    }))
}

export function getCumulativeAverageWithProjection(
    marks: Mark[],
    settings: Settings,
): MarksPerSemester[] {
    const grouped: Record<number, { mark: number; ects: number }[]> = {}
    marks.forEach(({ semester, mark, ects }) => {
        grouped[semester] = grouped[semester] || []
        grouped[semester].push({ mark, ects })
    })

    const sortedSemesters = Object.keys(grouped).map(Number).sort((a, b) => a - b)
    const result: MarksPerSemester[] = []
    let weightedSum = 0
    let completedEcts = 0

    for (const semester of sortedSemesters) {
        const entries = grouped[semester]
        for (const entry of entries) {
            weightedSum += entry.mark * entry.ects
            completedEcts += entry.ects
        }
        result.push({
            semester,
            average: Number((weightedSum / completedEcts).toFixed(2))
        })
    }

    const remainingEcts = settings.totalEcts - completedEcts
    const lastSemester = sortedSemesters.at(-1) ?? 0
    const remainingSemesters = settings.totalSemesters - lastSemester
    const futureSemesters = Array.from({ length: remainingSemesters }, (_, i) => lastSemester + i + 1)
    const baseEcts = Math.floor(remainingEcts / remainingSemesters)
    const leftover = remainingEcts % remainingSemesters

    const ectsDistribution = futureSemesters.map((_, i) =>
        i < leftover ? baseEcts + 1 : baseEcts
    )

    let bestSum = weightedSum
    let worstSum = weightedSum
    let predictedSum = weightedSum
    let runningEcts = completedEcts

    for (let i = 0; i < futureSemesters.length; i++) {
        const semester = futureSemesters[i]
        const ects = ectsDistribution[i]

        runningEcts += ects
        bestSum += (settings.isHigherMarkBetter ? 5.0 : 1.0) * ects
        worstSum += (settings.isHigherMarkBetter ? 1.0 : 4.0) * ects
        predictedSum += settings.ownPrediction * ects

        result.push({
            semester,
            best: Number((bestSum / runningEcts).toFixed(2)),
            worst: Number((worstSum / runningEcts).toFixed(2)),
            predicted: settings.ownPrediction > 0 ? Number((predictedSum / runningEcts).toFixed(2)) : undefined
        })
    }

    return result
}
