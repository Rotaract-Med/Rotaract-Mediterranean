import { createClient } from "@/lib/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("[v0] Error exchanging code for session:", exchangeError)
      return NextResponse.redirect(`${origin}/auth/error`)
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("[v0] Error getting user:", userError)
      return NextResponse.redirect(`${origin}/auth/error`)
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    let profile = null
    let retries = 3

    while (retries > 0 && !profile) {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single()

      if (data) {
        profile = data
        break
      }

      if (profileError) {
        console.error("[v0] Error fetching profile (attempt", 4 - retries, "):", profileError)
      }

      retries--
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    if (!profile) {
      console.log("[v0] Creating profile manually for user:", user.id)
      
      // Use service role client to bypass RLS
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_SUPABASESERVICE_KEY
      
      if (!serviceRoleKey) {
        console.error("[v0] Service role key not found in environment variables")
        return NextResponse.redirect(`${origin}/auth/error`)
      }

      const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      )

      const { data: insertData, error: insertError } = await serviceClient.from("profiles").insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        role: "member",
      })

      if (insertError) {
        console.error("[v0] Error creating profile:", insertError)
        console.error("[v0] Insert error details:", JSON.stringify(insertError, null, 2))
        return NextResponse.redirect(`${origin}/auth/error`)
      }

      console.log("[v0] Profile created successfully:", insertData)
      profile = { role: "member", full_name: user.user_metadata?.full_name || "User" }
    }

    console.log("[v0] User logged in successfully:", { userId: user.id, role: profile.role })

    const redirectPath = profile.role === "member" ? "/" : "/dashboard"
    return NextResponse.redirect(`${origin}${redirectPath}`)
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
