"use client";
import React, { useState } from 'react'
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'


const SignInForm = () => {
    const [email, setEmail] = useState<string>("")
    const [sent, setSent] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [code, setCode] = useState<string>("")
    const router = useRouter()


    const signInWithOtp = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true) 
        const supabase = createClient()
        const { error: supabaseError } = await supabase.auth.signInWithOtp({ email })
        if (supabaseError) {
            setError(supabaseError.message)
            setIsSubmitting(false)
            return
        }
        setSent(true)
        setIsSubmitting(false)
    }

    const verifyOtp = async (e: React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)
        const supabase = createClient()
        const { error:supabaseError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
        })
        if (supabaseError) {
            setError(supabaseError.message)
            setIsSubmitting(false)
            return
        }
        setIsSubmitting(false)
        router.refresh()
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
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending" : "Submit"}</Button>
                </form>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </>
        )
    }
    return (
        <>
            <p>Check your inbox — we sent a code to {email}</p>
            <Button type="button" onClick={()=>setSent(false)}>Change Email</Button>
            <form onSubmit={verifyOtp}>
                <Input
                    required
                    inputMode="numeric"
                    placeholder="Enter the eight digit OTP"
                    value={code}
                    maxLength={8}
                    onChange={(e) => setCode(e.target.value)}
                />
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Verifying" : "Enter"}</Button>
            </form>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </>


    )
}

export default SignInForm
