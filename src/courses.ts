import type { Exercise } from "./exercises";

export interface CourseChapter {
    id?: number;
    courseId?: number;
    name: string;
    exercises?: Exercise[];
    subchapters?: CourseChapter[];
}

export interface Course {
    id?: number;
    name: string;
    chapters: CourseChapter[];
}

export const courses: Course[] = [

]