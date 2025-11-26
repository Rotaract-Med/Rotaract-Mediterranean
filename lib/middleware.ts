import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check if Supabase credentials are configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase credentials not configured. Please check your .env.local file")
    return supabaseResponse
  }

  // Validate Supabase URL format (supports both hosted and self-hosted)
  try {
    new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  } catch (error) {
    console.error("Invalid Supabase URL format:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Session expires after 30 minutes of inactivity
        flowType: 'pkce',
      },
    },
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error("Failed to get user from Supabase:", error)
    return supabaseResponse
  }

  if (!user && !request.nextUrl.pathname.startsWith("/auth") && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname.startsWith("/dashboard")) {
    try {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (profile?.role === "member") {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    }
  }

  return supabaseResponse
}
