import { createClient } from '../lib/supabase/client'
import SignInForm from '@/components/sign-in-form';


export default async function Home() {
  
  
  return (
    <>
    <div>
      <SignInForm/>
    </div>
    </>
  );
}
