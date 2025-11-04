import { Exercise, type ExerciseType } from "./exercises";

export interface ExerciseData {
    type: ExerciseType;
    data: object;
}

export interface ChapterData {
    name: string;
    exercises?: ExerciseData[];
    subchapters?: ChapterData[];
}

export interface CourseData {
    name: string;
    chapters: ChapterData[];
}

export class Chapter {
    private static id = 0;

    public id: number;
    public courseId: number;
    public name: string;
    public exercises?: Exercise[] = [];
    public subchapters?: Chapter[] = [];

    constructor(courseId: number, chapterData: ChapterData) {
        this.id = Chapter.id++;
        this.courseId = courseId;
        this.name = chapterData.name;
        chapterData.exercises?.forEach((exerciseData) =>
            this.exercises?.push(
                new Exercise(
                    this.courseId,
                    this.id,
                    exerciseData.type,
                    exerciseData.data
                )
            )
        );
        chapterData.subchapters?.forEach((subchapterData) =>
            this.subchapters?.push(new Chapter(this.courseId, subchapterData))
        );
    }
}

export class Course {
    private static id = 0;

    public id: number;
    public chapters: Chapter[] = [];

    constructor(courseData: CourseData) {
        this.id = Course.id++;
        courseData.chapters.forEach((chapterData) =>
            this.chapters.push(new Chapter(this.id, chapterData))
        );
    }
}
