import { createClient } from '../lib/supabase/server'
import SignInForm from '@/components/sign-in-form';
import {Button} from '@/components/ui/button'
import {signOut} from './actions'


export default async function Home() {
  const supabase = await createClient()
  const {data} =  await supabase.auth.getClaims()
  const claims = data?.claims

  if (!claims){
    return <>
      <SignInForm />
    </>
  }

  return (
    <>
      <div>
        <p>Signed in as {claims.email}</p>
        <form action={signOut}>
          <Button type="submit">Sign out</Button>
        </form>
      </div>
    </>
  );
}
