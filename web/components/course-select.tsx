import React from 'react'


interface CourseSelectProps {
    slug: string;
    section: string;
    dept: string;
    course_code: string;
    course_name: string;
    enrolled: number;
    capacity: number;
    waitlist: number;
    campus: string;
    observed_at: string;
}
const CourseSelect = ({
    slug,
    section,
    dept,
    course_code,
    course_name,
    enrolled,
    capacity,
    waitlist,
    campus,
    observed_at,
}: CourseSelectProps) => {
    return (
        <>
        </>
    )
}

export default CourseSelect
