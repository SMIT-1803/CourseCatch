'use client';
import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase/client'

interface CourseData {
  slug:string;
  semester_code:string;
  dept:string;
  course_code:string;
  section:string;
  course_name:string;
  instructor:string;
  campus:string;
  enrolled:number;
  waitlist:number;
  capacity:number;
  observed_at:string
}

export default function Home() {
  const [coursesData, setCoursesData] = useState<CourseData[]>([]);

  useEffect(() => {
    const fetchData = async ()=>{
      try{
        const supabase = createClient();
        const {data,error} = await supabase.from("courses_database").select();
        if (error) {
          console.error("Supabase error:", error.message);
        } else if (data) {
          setCoursesData(data);
        }
      }
       catch (err) {
        console.error("Fetch error:", err);
      }
    }
    fetchData();
  },[])
  
  
  return (
    <>
    <div>
      {coursesData.map(course=>(
        <p key={course.slug}>{course.course_name}</p>
      ))}
    </div>
    </>
  );
}
