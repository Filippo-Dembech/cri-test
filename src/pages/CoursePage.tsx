import { Link, useParams } from "react-router-dom"
import Title from "../ui/Title"
import { courses } from "../courses";
import Button from "../ui/Button";

export default function CoursePage() {
    const { course } = useParams();
    
    const pickedCourse = courses.find((c) => c.acronym?.toLowerCase() === course?.toLowerCase());

    if (!pickedCourse) return <div>Course not found</div>

    return (
        <div>
            <Title h={1}>{pickedCourse.name.toUpperCase()}</Title>
            <div className="flex gap-4">
                <Link to={`/corsi/${pickedCourse.acronym}/teoria`}><Button>Ripasso Teoria</Button></Link>
                <Link to={`/corsi/${pickedCourse.acronym}/pratica`}><Button>Ripasso Pratica</Button></Link>
            </div>
        </div>
    )
}