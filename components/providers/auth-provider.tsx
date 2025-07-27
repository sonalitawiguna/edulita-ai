"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Changed from true to false

  useEffect(() => {
    // Initialize auth state immediately
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Check for existing mock user in localStorage first
      const savedUser = localStorage.getItem("edulita_mock_user")
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
          return
        } catch (error) {
          console.error("Error parsing saved user:", error)
          localStorage.removeItem("edulita_mock_user")
        }
      }

      // Check if Supabase is properly configured
      const isSupabaseConfigured =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://demo-project.supabase.co" &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "demo-anon-key"

      if (!isSupabaseConfigured) {
        console.log("🔧 Running in development mode with mock authentication")
        return
      }

      // Try Supabase auth if configured
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Supabase session error:", error)
          return
        }

        if (session?.user) {
          await loadUserProfile(session.user.id)
        }

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            await loadUserProfile(session.user.id)
          } else {
            setUser(null)
          }
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("Error initializing Supabase auth:", error)
      }
    } catch (error) {
      console.error("Error in initializeAuth:", error)
    }
  }

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error loading user profile:", error)
        // Create fallback user data
        const fallbackUser: User = {
          id: userId,
          email: "demo@example.com",
          role: "student",
          name: "Demo User",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setUser(fallbackUser)
      } else {
        setUser(data as User)
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
      // Create fallback user data
      const fallbackUser: User = {
        id: userId,
        email: "demo@example.com",
        role: "student",
        name: "Demo User",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setUser(fallbackUser)
    }
  }

  const login = async (email: string, password: string, role: string) => {
    try {
      setIsLoading(true)

      // Always use mock authentication for development
      console.log("🔧 Using mock authentication for development")

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: `mock-${role}-${Date.now()}`,
        email,
        role: role as User["role"],
        name: generateNameFromEmail(email),
        school_id: role === "student" || role === "teacher" || role === "principal" ? "mock-school-1" : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setUser(mockUser)
      localStorage.setItem("edulita_mock_user", JSON.stringify(mockUser))

      console.log("✅ Login successful:", mockUser.name, "-", mockUser.role)
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Login gagal. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      console.log("🚪 Starting logout process...")

      // Clear Supabase session if configured
      const isSupabaseConfigured =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://demo-project.supabase.co" &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "demo-anon-key"

      if (isSupabaseConfigured) {
        try {
          await supabase.auth.signOut()
          console.log("✅ Supabase session cleared")
        } catch (error) {
          console.error("Supabase logout error:", error)
        }
      }

      // Clear local storage
      localStorage.removeItem("edulita_mock_user")
      localStorage.removeItem("edulita_chat_history")
      console.log("🗑️ Local storage cleared")

      setUser(null)
      console.log("✅ Logout successful - user state cleared")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

function generateNameFromEmail(email: string): string {
  const username = email.split("@")[0]
  return username.charAt(0).toUpperCase() + username.slice(1).replace(/[._-]/g, " ")
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }
