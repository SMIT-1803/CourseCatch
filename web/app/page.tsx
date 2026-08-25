import { createClient } from '../lib/supabase/server'
import SignInForm from '@/components/sign-in-form';
import { Button } from '@/components/ui/button'
import { signOut } from './actions'
import CourseSearch from '@/components/course-search';
import WatchList, {type Watch} from '@/components/watch-list'


export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (!claims) {
    return <>
      <SignInForm />
    </>
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
    return <p>Couldn&apos;t load courses. Try again.</p>
  }
  if (watchError){
    return <p>Couldn&apos;t load triggers. Try again.</p>
  }
  const watchList = (watches ?? []).map((w) => ({
  ...w,
  courses_database: w.courses_database as unknown as Watch["courses_database"],
  })) as Watch[];

  return (
    <>
      <div>
        <p>Signed in as {claims.email}</p>
        <form action={signOut}>
          <Button type="submit">Sign out</Button>
        </form>
        <CourseSearch courses={course_catalogue || []} />
        <WatchList triggers={watchList} />
      </div>
    </>
  );
}
