import { createClient } from "@supabase/supabase-js"

// Check if environment variables are properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Only create a real Supabase client if properly configured
const isSupabaseConfigured =
  supabaseUrl !== "https://placeholder.supabase.co" &&
  supabaseUrl !== "https://demo-project.supabase.co" &&
  supabaseAnonKey !== "placeholder-key" &&
  supabaseAnonKey !== "demo-anon-key"

// Create client with error handling
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient("https://placeholder.supabase.co", "placeholder-key", {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

// Helper function to check if Supabase is configured
export const isSupabaseReady = () => isSupabaseConfigured

// Database types
export interface User {
  id: string
  email: string
  role: "student" | "teacher" | "principal" | "department" | "industry" | "superadmin"
  name: string
  school_id?: string
  created_at: string
  updated_at: string
}

export interface School {
  id: string
  name: string
  address: string
  principal_id?: string
  accreditation: "A" | "B" | "C"
  total_students: number
  total_teachers: number
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  name: string
  grade: string
  school_id: string
  teacher_id: string
  student_count: number
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id: string
  class_id: string
  student_number: string
  grade: string
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: string
  user_id: string
  school_id: string
  subject: string
  employee_number: string
  created_at: string
  updated_at: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  class_id: string
  teacher_id: string
  due_date: string
  total_points: number
  created_at: string
  updated_at: string
}

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  content: string
  file_url?: string
  score?: number
  feedback?: string
  submitted_at: string
  graded_at?: string
}

export interface Quiz {
  id: string
  title: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  questions: any[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  student_id: string
  answers: any[]
  score: number
  completed_at: string
}

export interface Document {
  id: string
  title: string
  file_url: string
  file_type: string
  file_size: number
  summary?: string
  extracted_text?: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  message: string
  response: string
  context: any
  created_at: string
}
