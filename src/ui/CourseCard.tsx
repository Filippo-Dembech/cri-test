import { Link } from "react-router-dom"

interface CourseCardProps {
    name: string
}

export default function CourseCard({ name }: CourseCardProps) {
    return (
        <div className="bg-red-300 p-8 rounded-xl cursor-pointer">
            <Link to={`/${name.toLowerCase()}`} className="text-4xl text-red-600 font-bold">{name}</Link>
        </div>
    )
}