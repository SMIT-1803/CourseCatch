"use client";
import React, { useState } from 'react'
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


const SignInForm = () => {
    const [email, setEmail] = useState<string>("")
    const [sent, setSent] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)


    const signInWithOtp = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        const supabase = createClient()
        const { error: supabaseError } = await supabase.auth.signInWithOtp({ email })
        if (supabaseError) {
            setError(supabaseError.message)
            return
        }

        setSent(true)
    }
    if (!sent) {
        return (
            <>
                <form onSubmit={signInWithOtp}>
                    <Input
                        required
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit">Submit</Button>
                </form>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </>
        )
    }
    return (
        <p>Check your inbox — we sent a code to {email}</p>
    )
}

export default SignInForm
