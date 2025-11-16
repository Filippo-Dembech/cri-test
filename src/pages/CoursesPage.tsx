import { Link } from "react-router-dom";
import Title from "../ui/Title";
import Background from "../ui/Background";

interface CourseLink {
    name: string;
    url: string;
}
interface CoursesPageProps {
    coursesLinks: CourseLink[];
}

export default function CoursesPage({ coursesLinks }: CoursesPageProps) {
    return (
        <div>
            <Title h={1}>Corsi</Title>
            <Background />
            <div className="flex flex-col gap-4 max-w-120 w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {coursesLinks.map(({ name, url }) => (
                    <div className="bg-red-200 p-2 rounded-xl cursor-pointer transition-all hover:tracking-widest">
                        <Link
                            to={`${url.toLowerCase()}`}
                            className=" text-red-600 uppercase"
                        >
                            {name}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
