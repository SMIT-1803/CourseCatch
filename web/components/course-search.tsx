import React from 'react'

interface CoursesProps {
  courses: {
    slug:string;
    dept:string;
    course_code:string;
    section:string;
    course_name:string;
    campus:string;
    instructor:string;
    enrolled:number;
    capacity:number;
    waitlist:number;
    observed_at:string;
  }[]; 
}

const CourseSearch = ({courses}:CoursesProps) => {
  return (
    <div>
      {courses.map(course=>(
        <div key={course.slug}>
          {course.section} {course.course_code} - {course.course_name}
        </div>
      ))}
    </div>
  )
}

export default CourseSearch
