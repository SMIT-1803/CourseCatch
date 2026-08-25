"use client";
import React, { useState } from 'react'
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
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
            <form onSubmit={signInWithOtp} className="space-y-3">
                <div className="space-y-1.5">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                        id="signin-email"
                        required
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand text-white hover:bg-brand/90"
                >
                    {isSubmitting ? "Sending" : "Send code"}
                </Button>
                {error && <p className="text-sm text-destructive">{error}</p>}
            </form>
        )
    }
    return (
        <div className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
                Check your inbox — we sent a code to{" "}
                <span className="font-medium text-foreground">{email}</span>
            </p>
            <form onSubmit={verifyOtp} className="space-y-3">
                <InputOTP
                    maxLength={8}
                    inputMode="numeric"
                    autoFocus
                    value={code}
                    onChange={(value) => setCode(value)}
                    containerClassName="justify-center"
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                    </InputOTPGroup>
                </InputOTP>
                <Button
                    type="submit"
                    disabled={isSubmitting || code.length !== 8}
                    className="w-full bg-brand text-white hover:bg-brand/90"
                >
                    {isSubmitting ? "Verifying" : "Verify code"}
                </Button>
                {error && <p className="text-sm text-destructive">{error}</p>}
            </form>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => setSent(false)}
            >
                Change Email
            </Button>
        </div>
    )
}

export default SignInForm
