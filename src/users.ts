export interface User {
    id: number;
    firstName: string;
    lastName: string;
    password: string;   // to hash
    enrolledCoursesId: number[];
}

export const users: User[] = [
]