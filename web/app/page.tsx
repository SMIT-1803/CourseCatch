import { createClient } from '../lib/supabase/server'
import SignInForm from '@/components/sign-in-form';
import {Button} from '@/components/ui/button'
import {signOut} from './actions'
import CourseSearch from '@/components/course-search';


export default async function Home() {
  const supabase = await createClient()
  const {data} =  await supabase.auth.getClaims()
  const claims = data?.claims

  if (!claims){
    return <>
      <SignInForm />
    </>
  }
  const { data: course_catalogue, error } = await supabase
    .from("courses_database")
    .select('slug, dept, course_code, section, course_name, campus, instructor, enrolled, capacity, waitlist, observed_at')

  if (error) {
    return <p>Couldn&apos;t load courses. Try again.</p>
  }

  return (
    <>
      <div>
        <p>Signed in as {claims.email}</p>
        <form action={signOut}>
          <Button type="submit">Sign out</Button>
        </form>
        <CourseSearch courses={course_catalogue || []}/>
      </div>
    </>
  );
}
