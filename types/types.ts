export type Mark = {
    moduleName: string;
    ects: number;
    semester: number;
    percentage: number;
    mark: number;
};

export type MarksPerSemester = {
    semester: number;
    average?: number;
    best?: number;
    worst?: number;
};