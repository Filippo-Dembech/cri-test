import { Link } from "react-router-dom";
import Title from "../ui/Title";
import Background from "../ui/Background";
import { courses } from "../courses";
import Button from "../ui/Button";
import Popup from "reactjs-popup";

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
                {coursesLinks.map(({ name: courseName, url }) => (
                    <div className="bg-red-200 p-2 rounded-xl cursor-pointer transition-all mx-8 hover:tracking-widest">
                        {courses.find(
                            (course) => course.name === courseName,
                        ) ? (
                            <Link
                                to={`${url.toLowerCase()}`}
                                className=" text-red-600 uppercase text-sm font-bold"
                            >
                                {courseName}
                            </Link>
                        ) : (
                            <Popup
                                trigger={
                                    <button className="text-red-600 uppercase cursor-pointer text-sm">
                                        {courseName}
                                    </button>
                                }
                                modal
                                nested
                                overlayStyle={{
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                }}
                            >
                                {(close) => (
                                    <div className="bg-white p-8 rounded-2xl flex flex-col gap-4 mx-8">
                                        <h3 className="text-2xl">
                                            Coming Soon
                                        </h3>
                                        <p>
                                            Quiz su "{courseName}" arriveranno in futuro.
                                        </p>
                                        <Button onClick={close} className="justify-center">Chiudi</Button>
                                    </div>
                                )}
                            </Popup>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
