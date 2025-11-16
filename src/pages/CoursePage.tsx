import { Link, useParams } from "react-router-dom";
import Title from "../ui/Title";
import { courses } from "../courses";
import Button from "../ui/Button";
import Background from "../ui/Background";
import { IoSchool } from "react-icons/io5";
import { FaAmbulance } from "react-icons/fa";

export default function CoursePage() {
    const { course } = useParams();

    const pickedCourse = courses.find(
        (c) => c.acronym?.toLowerCase() === course?.toLowerCase()
    );

    if (!pickedCourse) return <div>Course not found</div>;

    return (
        <div>
            <Title h={1}>{pickedCourse.name.toUpperCase()}</Title>
            <Background />
            <div className="flex gap-4 absolute top-0 -translate-y-1/2 border-4">
                <Link to={`/corsi/${pickedCourse.acronym}/teoria`}>
                    <Button icon={<IoSchool />}>Ripasso Teoria</Button>
                </Link>
                <Link to={`/corsi/${pickedCourse.acronym}/pratica`}>
                    <Button icon={<FaAmbulance />}>Ripasso Pratica</Button>
                </Link>
            </div>
        </div>
    );
}
