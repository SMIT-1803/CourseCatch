import { createClient } from '../lib/supabase/server'
import LandingPage from '@/components/landing/landing-page';
import SiteHeader from '@/components/site-header'
import CourseSearch from '@/components/course-search';
import WatchList, {type Watch} from '@/components/watch-list'


export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (!claims) {
    return <LandingPage />
  }
  const { data: course_catalogue, error } = await supabase
    .from("courses_database")
    .select('slug, dept, course_code, section, course_name, campus, instructor, enrolled, capacity, waitlist, observed_at')

  const { data: watches, error: watchError } = await supabase
    .from("triggers")
    .select(`
    id,
    condition,
    threshold,
    created_at,
    courses_database (
      slug, dept, course_code, section, course_name,
      campus, enrolled, capacity, waitlist, observed_at
    )
  `)
    .eq("user_id", claims.sub)
    .eq("fired", false)
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <>
        <SiteHeader email={String(claims.email ?? "")} />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-sm text-muted-foreground">Couldn&apos;t load courses. Try again.</p>
        </main>
      </>
    )
  }
  if (watchError){
    return (
      <>
        <SiteHeader email={String(claims.email ?? "")} />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-sm text-muted-foreground">Couldn&apos;t load triggers. Try again.</p>
        </main>
      </>
    )
  }
  const watchList = (watches ?? []).map((w) => ({
  ...w,
  courses_database: w.courses_database as unknown as Watch["courses_database"],
  })) as Watch[];

  return (
    <>
      <SiteHeader email={String(claims.email ?? "")} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* Search leads: adding a watch never gets buried under the list. */}
        <section className="mx-auto max-w-2xl">
          <CourseSearch courses={course_catalogue || []} />
        </section>
        <h2 className="mt-8 flex items-baseline gap-2 px-1 text-sm font-medium">
          Watching
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {watchList.length}
          </span>
        </h2>
        <div className="mt-3">
          <WatchList triggers={watchList} />
        </div>
      </main>
    </>
  );
}
