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

export interface Course {
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

/** A section with room and nobody queued can't be watched — the guard refuses it. */
export const hasRoomNow = (c: Pick<Course, "enrolled" | "capacity" | "waitlist">) =>
  c.enrolled < c.capacity && c.waitlist === 0;

const CourseSearch = ({ courses }: CoursesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sliceCount, setSliceCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Course | null>(null);

  const courseWithKeys = useMemo(
    () =>
      courses.map((course) => ({
        ...course,
        searchCode: (course.dept + course.course_code)
          .toLowerCase()
          .replace(/\s+/g, ""),
        searchName: course.course_name.toLowerCase(),
      })),
    [courses]
  );

  const allMatches = useMemo(() => {
    const cleanQuery = searchQuery.toLowerCase().trim();
    const queryNoSpace = cleanQuery.replace(/\s+/g, "");
    if (queryNoSpace.length < 2) return [];
    return courseWithKeys.filter(
      (c) =>
        c.searchCode.includes(queryNoSpace) || c.searchName.includes(cleanQuery)
    );
  }, [searchQuery, courseWithKeys]);

  const visible = allMatches.slice(0, sliceCount);
  const hasMore = allMatches.length > sliceCount;

  const handleQueryChange = (value: string) => {
    setSearchQuery(value);
    setSliceCount(PAGE_SIZE);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border/60 bg-card">
        <Command shouldFilter={false} className="bg-transparent">
          <CommandInput
            placeholder="Search by course code or name — try CMPT 225"
            value={searchQuery}
            onValueChange={handleQueryChange}
          />

          {searchQuery.trim().length >= 2 && (
            <CommandList className="max-h-104">
              {allMatches.length === 0 && (
                <CommandEmpty className="px-3 py-8 text-center">
                  <p className="text-sm font-medium">No sections match that</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try a course code like <span className="font-mono">cmpt 225</span>
                  </p>
                </CommandEmpty>
              )}

              {visible.map((course) => {
                const roomNow = hasRoomNow(course);
                return (
                  <CommandItem
                    key={course.slug}
                    value={course.slug}
                    onSelect={() => setSelected(course)}
                    className="gap-3 px-3 py-2.5"
                  >
                    {/* section code — the disambiguator, so it leads */}
                    <span className="w-14 shrink-0 font-mono text-xs font-semibold tracking-tight text-foreground">
                      {course.section}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-1 text-sm">
                        <span className="shrink-0 font-medium whitespace-nowrap">
                          {course.dept} {course.course_code}
                        </span>
                        <span className="min-w-0 truncate text-muted-foreground">
                          — {course.course_name}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {course.campus}
                        {course.instructor && ` · ${course.instructor}`}
                      </span>
                    </span>

                    {/* figures: tabular so digits align down the column */}
                    <span className="shrink-0 text-right font-mono text-xs tabular-nums">
                      <span
                        className={
                          roomNow ? "text-warning-foreground" : "text-foreground"
                        }
                      >
                        {course.enrolled}/{course.capacity}
                      </span>
                      <span className="ml-2 inline-block w-10 text-muted-foreground">
                        {course.waitlist > 0 ? `+${course.waitlist}` : "—"}
                      </span>
                    </span>
                  </CommandItem>
                );
              })}

              {hasMore && (
                <div className="px-3 py-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-muted-foreground"
                    onClick={() => setSliceCount(sliceCount + PAGE_SIZE)}
                  >
                    Show {Math.min(PAGE_SIZE, allMatches.length - sliceCount)} more
                    <span className="ml-1 opacity-60">
                      ({allMatches.length - sliceCount} left)
                    </span>
                  </Button>
                </div>
              )}
            </CommandList>
          )}
        </Command>
      </div>
      <CourseSelect
        course={selected}
        onClose={() => setSelected(null)}
        onAdded={() => handleQueryChange("")}
      />
    </div>
  );
};

export default CourseSearch;