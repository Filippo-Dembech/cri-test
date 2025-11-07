import { Link } from "react-router-dom";
import Title from "../ui/Title";

interface CourseLink {
    name: string;
    url: string;
}
interface CoursesPageProps {
    coursesLinks: CourseLink[];
}

function Background() {
    return (
        <div className="absolute inset-0 overflow-hidden -z-10">
            <img
                className="opacity-7 absolute -top-1/2 -right-1/2"
                src="/CRI_logo.png"
            />
        </div>
    );
}

export default function CoursesPage({ coursesLinks }: CoursesPageProps) {
    return (
        <div>
            <Title h={1}>Corsi</Title>
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
            <Background />
        </div>
    );
}
