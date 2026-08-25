"use server";
import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
}

interface ReturnValFormat {
    condition: string,
    status: "ok" | "error",
    message: string
}

interface freshDataFormat {
    enrolled: number;
    capacity: number;
    waitlist: number;
    observed_at: string;
}



function createReturnObject(condition: string, status: "ok" | "error", message: string) {
    return {
        condition: condition, status: status, message: message
    }
}

async function insertTrigger(user_id: string, slug: string, condition: string, threshold: number | null = null) {
    const supabase = await createClient()

    const { data: TriggerData, error: e } = await supabase.from("triggers")
        .insert({
            user_id: user_id,
            slug: slug,
            condition: condition,
            threshold: threshold,
        })
    if (e != null) {
        return [createReturnObject(condition, "error", `Trouble having insert the alert. Please try again later.`)]
    }
    return [
        createReturnObject(condition, "ok", "Successful")]

}

async function fetchFreshData(supabase: SupabaseClient, slug: string) {
    const { data: freshData, error: freshDataFetchError } = await supabase
        .from('courses_database')
        .select('enrolled, capacity, waitlist, observed_at')
        .eq('slug', slug)
        .single()

    return { freshData, freshDataFetchError }
}

async function insertOpenSeat(user_id: string, slug: string, freshData: freshDataFormat, returnVal: ReturnValFormat[]) {
    const enrolled = freshData.enrolled
    const capacity = freshData.capacity
    const waitlist = freshData.waitlist
    const observed_at = freshData.observed_at
    if (enrolled < capacity && waitlist === 0) {
        returnVal.push(createReturnObject("open_seat", "error", `Latest data as of ${observed_at} shows class has open seats. Nothing to wait on`))
    }
    else {
        const openSeatRes = await insertTrigger(user_id, slug, "open_seat")
        returnVal.push(openSeatRes[0])
    }
}

async function insertWaitlistBelow(user_id: string, slug: string, threshold: number, freshData: freshDataFormat, returnVal: ReturnValFormat[]) {
    const waitlist = freshData.waitlist
    const observed_at = freshData.observed_at
    if (waitlist < threshold) {
        returnVal.push(createReturnObject("waitlist_below", "error", `Latest data as of ${observed_at} shows section's waitlist is below threshold ${threshold}`))
    }
    else {
        const waitlistBelowRes = await insertTrigger(user_id, slug, "waitlist_below", threshold)
        returnVal.push(waitlistBelowRes[0])
    }
}


export async function addTrigger(slug: string, wantOpenSeat: boolean, wantWaitlistBelow: boolean, threshold: number) {
    let returnVal: ReturnValFormat[] = []
    const supabase = await createClient()
    const { data: claimsData } = await supabase.auth.getClaims()
    const userId = claimsData?.claims?.sub
    if (!userId) {
        return [
            createReturnObject("", "error", "User not signed in.")];
    }
    const { freshData, freshDataFetchError } = await fetchFreshData(supabase, slug)
    if (freshDataFetchError != null || freshData == null) {
        return [
            createReturnObject("", "error", "Facing trouble pulling data. Please try again later.")]
    }

    const { data: existingTriggers, error: e } = await supabase.from("triggers").select("user_id, slug, condition, threshold").eq("user_id", userId).eq("slug", slug)
    if (e != null) {
        return [createReturnObject("", "error", "Facing trouble triggers data. Please try again later.")]
    }

    let hasOpenSeatTrigger = false
    let hasWaitlistTriger = false

    for (const trigger of existingTriggers) {
        if (trigger.condition == "open_seat") {
            hasOpenSeatTrigger = true
        }
        if (trigger.condition == "waitlist_below") {
            hasWaitlistTriger = true
        }
    }

    if (wantOpenSeat) {
        if (hasOpenSeatTrigger) {
            returnVal.push(createReturnObject("open_seat", "error", "You're already watching this section for open seats."))
        }
        else { await insertOpenSeat(userId, slug, freshData, returnVal) }
    }
    if (wantWaitlistBelow) {
        if (hasWaitlistTriger) {
            returnVal.push(createReturnObject("waitlist_below", "error", `You're already watching this section for waitlist.`))
        }
        else {
            if (Number.isInteger(threshold) && threshold >= 1) {
                await insertWaitlistBelow(userId, slug, threshold, freshData, returnVal)
            }
            else {
                returnVal.push(createReturnObject("waitlist_below", "error", "Threshold should be greater than 0"))
            }
        }
    }
    revalidatePath("/")
    return returnVal
}