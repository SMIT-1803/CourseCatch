"use client";

import React, { useState, useMemo } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import CourseSelect from "./course-select";

interface Course {
  slug: string;
  dept: string;
  course_code: string;
  section: string;
  course_name: string;
  campus: string;
  instructor: string;
  enrolled: number;
  capacity: number;
  waitlist: number;
  observed_at: string;
}

interface CoursesProps {
  courses: Course[];
}

const PAGE_SIZE = 40;

const CourseSearch = ({ courses }: CoursesProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sliceCount, setSliceCount] = useState<number>(PAGE_SIZE);

  const courseWithKeys = useMemo(() => {
    return courses.map((course) => ({
      ...course,
      searchCode: (course.dept + course.course_code)
        .toLowerCase()
        .replace(/\s+/g, ""),
      searchName: course.course_name.toLowerCase(),
    }));
  }, [courses]);

  // All matches, uncapped — needed to know whether "show more" applies.
  const allMatches = useMemo(() => {
    const cleanQuery = searchQuery.toLowerCase().trim();
    const queryNoSpace = cleanQuery.replace(/\s+/g, "");

    if (queryNoSpace.length < 2) return [];

    return courseWithKeys.filter(
      (course) =>
        course.searchCode.includes(queryNoSpace) ||
        course.searchName.includes(cleanQuery)
    );
  }, [searchQuery, courseWithKeys]);

  const visibleCourses = allMatches.slice(0, sliceCount);
  const hasMore = allMatches.length > sliceCount;

  const handleQueryChange = (value: string) => {
    setSearchQuery(value);
    setSliceCount(PAGE_SIZE); // reset paging on a new query
  };

  return (
    <div>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search courses..."
          value={searchQuery}
          onValueChange={handleQueryChange}
        />

        {searchQuery.trim().length >= 2 && (
          <CommandList>
            {allMatches.length === 0 && (
              <CommandEmpty>
                No results found for {searchQuery}
              </CommandEmpty>
            )}

            {visibleCourses.map((course) => (
              <CommandItem key={course.slug} value={course.slug}>
                <CourseSelect
                  slug={course.slug}
                  section={course.section}
                  dept={course.dept}
                  course_code={course.course_code}
                  course_name={course.course_name}
                  enrolled={course.enrolled}
                  capacity={course.capacity}
                  waitlist={course.waitlist}
                  campus={course.campus}
                  observed_at={course.observed_at}
                />
              </CommandItem>
            ))}

            {hasMore && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSliceCount(sliceCount + PAGE_SIZE)}
              >
                Show more ({allMatches.length - sliceCount} remaining)
              </Button>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default CourseSearch;