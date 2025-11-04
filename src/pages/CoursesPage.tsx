import CourseCard from "../ui/CourseCard";

interface CoursesPageProps {
    courses: string[];
}

export default function CoursesPage({ courses }: CoursesPageProps) {
    return (
        <div>
            <h1 className="text-6xl mb-8">Corsi</h1>
            <div className="flex flex-wrap gap-4">
                {courses.map(course => (
                    <CourseCard name={course} />
                ))}
            </div>
        </div>
    )
}