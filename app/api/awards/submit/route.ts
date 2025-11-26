import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nominee_name, award_category, nomination_reason, nominator_email, nominator_name, nominee_email } = body

    if (!nominee_name || !award_category || !nomination_reason || !nominator_email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.from("award_submissions").insert([
      {
        nominee_name,
        award_category,
        nomination_reason,
        nominator_email,
        nominator_name: nominator_name || null,
        nominee_email: nominee_email || null,
        status: "pending",
      },
    ])

    if (error) {
      console.error("[v0] Error submitting award:", error)
      return NextResponse.json({ error: "Failed to submit nomination" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error in award submission:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
