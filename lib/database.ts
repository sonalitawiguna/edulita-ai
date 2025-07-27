import { supabase } from "./supabase"
import type { User, School, Class, Assignment, Submission, Quiz, QuizAttempt, Document, ChatMessage } from "./supabase"

// Enhanced mock data for development
const mockData = {
  users: [
    {
      id: "mock-student-1",
      email: "siswa@demo.com",
      role: "student" as const,
      name: "Ahmad Siswa",
      school_id: "mock-school-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "mock-teacher-1",
      email: "guru@demo.com",
      role: "teacher" as const,
      name: "Siti Guru",
      school_id: "mock-school-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  schools: [
    {
      id: "mock-school-1",
      name: "SMA Negeri 1 Demo",
      address: "Jl. Demo No. 123, Jakarta",
      accreditation: "A" as const,
      total_students: 500,
      total_teachers: 25,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  quizzes: [
    {
      id: "mock-quiz-1",
      title: "Kuis Matematika Dasar",
      subject: "Matematika",
      difficulty: "easy" as const,
      questions: [
        {
          id: "1",
          question: "Berapakah hasil dari 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1,
          explanation: "2 + 2 = 4",
        },
        {
          id: "2",
          question: "Berapakah hasil dari 5 × 3?",
          options: ["12", "15", "18", "20"],
          correctAnswer: 1,
          explanation: "5 × 3 = 15",
        },
      ],
      created_by: "mock-teacher-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "mock-quiz-2",
      title: "Kuis Fisika - Hukum Newton",
      subject: "Fisika",
      difficulty: "medium" as const,
      questions: [
        {
          id: "1",
          question: "Hukum Newton I menyatakan bahwa...",
          options: [
            "Benda bergerak dengan kecepatan konstan jika tidak ada gaya yang bekerja",
            "F = ma",
            "Setiap aksi memiliki reaksi yang sama besar dan berlawanan arah",
            "Energi tidak dapat diciptakan atau dimusnahkan",
          ],
          correctAnswer: 0,
          explanation:
            "Hukum Newton I (Hukum Inersia) menyatakan bahwa benda akan tetap diam atau bergerak lurus beraturan jika tidak ada gaya luar yang bekerja",
        },
      ],
      created_by: "mock-teacher-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  // Mock chat history for development
  chatHistory: [] as ChatMessage[],
}

// Helper function to check if we should use Supabase
function shouldUseSupabase(): boolean {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Check if Supabase is properly configured
    const isConfigured =
      supabaseUrl &&
      supabaseKey &&
      supabaseUrl !== "https://demo-project.supabase.co" &&
      supabaseUrl !== "https://placeholder.supabase.co" &&
      supabaseKey !== "demo-anon-key" &&
      supabaseKey !== "placeholder-key" &&
      supabaseUrl.includes("supabase.co") &&
      supabaseKey.length > 50

    console.log("🔍 Supabase configuration check:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlValid: supabaseUrl?.includes("supabase.co"),
      keyValid: supabaseKey && supabaseKey.length > 50,
      isConfigured,
    })

    return isConfigured
  } catch (error) {
    console.error("Error checking Supabase configuration:", error)
    return false
  }
}

// User operations
export const userService = {
  async getCurrentUser() {
    if (!shouldUseSupabase()) {
      // Return mock user for development
      const savedUser = localStorage.getItem("edulita_mock_user")
      if (savedUser) {
        try {
          return JSON.parse(savedUser) as User
        } catch {
          return mockData.users[0] as User
        }
      }
      return mockData.users[0] as User
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (error) throw error
      return data as User
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    if (!shouldUseSupabase()) {
      // Mock update for development
      return { ...mockData.users[0], ...updates } as User
    }

    try {
      const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

      if (error) throw error
      return data as User
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  },

  async getUsersByRole(role: User["role"]) {
    if (!shouldUseSupabase()) {
      return mockData.users.filter((user) => user.role === role) as User[]
    }

    try {
      const { data, error } = await supabase.from("users").select("*").eq("role", role)

      if (error) throw error
      return data as User[]
    } catch (error) {
      console.error("Error getting users by role:", error)
      return []
    }
  },
}

// School operations
export const schoolService = {
  async getSchoolById(schoolId: string) {
    if (!shouldUseSupabase()) {
      // Return mock school data
      return mockData.schools[0] as School
    }

    try {
      const { data, error } = await supabase.from("schools").select("*").eq("id", schoolId).single()

      if (error) throw error
      return data as School
    } catch (error) {
      console.error("Error getting school:", error)
      return mockData.schools[0] as School
    }
  },

  async getSchoolStats(schoolId: string) {
    if (!shouldUseSupabase()) {
      return {
        school: mockData.schools[0] as School,
        totalClasses: 12,
        totalTeachers: 25,
        totalStudents: 500,
      }
    }

    try {
      const { data: school, error: schoolError } = await supabase
        .from("schools")
        .select("*")
        .eq("id", schoolId)
        .single()

      if (schoolError) throw schoolError

      const { data: classes, error: classError } = await supabase.from("classes").select("*").eq("school_id", schoolId)

      if (classError) throw classError

      const { data: teachers, error: teacherError } = await supabase
        .from("teachers")
        .select("*")
        .eq("school_id", schoolId)

      if (teacherError) throw teacherError

      return {
        school: school as School,
        totalClasses: classes?.length || 0,
        totalTeachers: teachers?.length || 0,
        totalStudents: school.total_students,
      }
    } catch (error) {
      console.error("Error getting school stats:", error)
      return {
        school: mockData.schools[0] as School,
        totalClasses: 12,
        totalTeachers: 25,
        totalStudents: 500,
      }
    }
  },

  async updateSchool(schoolId: string, updates: Partial<School>) {
    if (!shouldUseSupabase()) {
      return { ...mockData.schools[0], ...updates } as School
    }

    try {
      const { data, error } = await supabase.from("schools").update(updates).eq("id", schoolId).select().single()

      if (error) throw error
      return data as School
    } catch (error) {
      console.error("Error updating school:", error)
      throw error
    }
  },
}

// Student operations
export const studentService = {
  async getStudentProfile(userId: string) {
    if (!shouldUseSupabase()) {
      return {
        id: "mock-student-profile-1",
        user_id: userId,
        class_id: "mock-class-1",
        student_number: "2024001",
        grade: "10",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    try {
      const { data, error } = await supabase
        .from("students")
        .select(`
          *,
          user:users(*),
          class:classes(*, school:schools(*))
        `)
        .eq("user_id", userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error getting student profile:", error)
      return {
        id: "mock-student-profile-1",
        user_id: userId,
        class_id: "mock-class-1",
        student_number: "2024001",
        grade: "10",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
  },

  async getStudentStats(studentId: string) {
    if (!shouldUseSupabase()) {
      // Return enhanced mock stats for development
      return {
        totalQuizzes: 8,
        averageQuizScore: 87.5,
        totalAssignments: 5,
        averageAssignmentScore: 85.2,
        overallAverage: 86.35,
        recentQuizzes: [
          { id: "1", title: "Kuis Matematika", score: 90, subject: "Matematika" },
          { id: "2", title: "Kuis Fisika", score: 85, subject: "Fisika" },
        ],
      }
    }

    try {
      // Get quiz attempts
      const { data: quizAttempts, error: quizError } = await supabase
        .from("quiz_attempts")
        .select("score, completed_at")
        .eq("student_id", studentId)

      if (quizError) throw quizError

      // Get submissions
      const { data: submissions, error: submissionError } = await supabase
        .from("submissions")
        .select("score, submitted_at")
        .eq("student_id", studentId)
        .not("score", "is", null)

      if (submissionError) throw submissionError

      const totalQuizzes = quizAttempts?.length || 0
      const averageQuizScore = quizAttempts?.length
        ? quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length
        : 0

      const totalAssignments = submissions?.length || 0
      const averageAssignmentScore = submissions?.length
        ? submissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / submissions.length
        : 0

      return {
        totalQuizzes,
        averageQuizScore,
        totalAssignments,
        averageAssignmentScore,
        overallAverage: (averageQuizScore + averageAssignmentScore) / 2,
      }
    } catch (error) {
      console.error("Error getting student stats:", error)
      return {
        totalQuizzes: 8,
        averageQuizScore: 87.5,
        totalAssignments: 5,
        averageAssignmentScore: 85.2,
        overallAverage: 86.35,
      }
    }
  },
}

// Quiz operations
export const quizService = {
  async getAllQuizzes() {
    if (!shouldUseSupabase()) {
      return mockData.quizzes as Quiz[]
    }

    try {
      const { data, error } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data as Quiz[]
    } catch (error) {
      console.error("Error getting quizzes:", error)
      return mockData.quizzes as Quiz[]
    }
  },

  async getQuizById(quizId: string) {
    if (!shouldUseSupabase()) {
      return mockData.quizzes.find((q) => q.id === quizId) || (mockData.quizzes[0] as Quiz)
    }

    try {
      const { data, error } = await supabase.from("quizzes").select("*").eq("id", quizId).single()

      if (error) throw error
      return data as Quiz
    } catch (error) {
      console.error("Error getting quiz:", error)
      return mockData.quizzes[0] as Quiz
    }
  },

  async createQuiz(quizData: Omit<Quiz, "id" | "created_at" | "updated_at">) {
    if (!shouldUseSupabase()) {
      return {
        ...quizData,
        id: `mock-quiz-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Quiz
    }

    try {
      const { data, error } = await supabase.from("quizzes").insert(quizData).select().single()

      if (error) throw error
      return data as Quiz
    } catch (error) {
      console.error("Error creating quiz:", error)
      throw error
    }
  },

  async submitQuizAttempt(attemptData: Omit<QuizAttempt, "id" | "completed_at">) {
    if (!shouldUseSupabase()) {
      return {
        ...attemptData,
        id: `mock-attempt-${Date.now()}`,
        completed_at: new Date().toISOString(),
      } as QuizAttempt
    }

    try {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .insert({
          ...attemptData,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data as QuizAttempt
    } catch (error) {
      console.error("Error submitting quiz attempt:", error)
      return {
        ...attemptData,
        id: `mock-attempt-${Date.now()}`,
        completed_at: new Date().toISOString(),
      } as QuizAttempt
    }
  },

  async getStudentQuizAttempts(studentId: string) {
    if (!shouldUseSupabase()) {
      return [
        {
          id: "mock-attempt-1",
          quiz_id: "mock-quiz-1",
          student_id: studentId,
          score: 90,
          completed_at: new Date().toISOString(),
          quiz: {
            title: "Kuis Matematika Dasar",
            subject: "Matematika",
            difficulty: "easy",
          },
        },
        {
          id: "mock-attempt-2",
          quiz_id: "mock-quiz-2",
          student_id: studentId,
          score: 85,
          completed_at: new Date().toISOString(),
          quiz: {
            title: "Kuis Fisika - Hukum Newton",
            subject: "Fisika",
            difficulty: "medium",
          },
        },
      ]
    }

    try {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select(`
          *,
          quiz:quizzes(title, subject, difficulty)
        `)
        .eq("student_id", studentId)
        .order("completed_at", { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error getting student quiz attempts:", error)
      return []
    }
  },
}

// Chat operations - Enhanced with better error handling
export const chatService = {
  async saveChatMessage(messageData: Omit<ChatMessage, "id" | "created_at">) {
    console.log("💾 Attempting to save chat message...")

    // Always try localStorage first for reliability
    try {
      const chatHistory = JSON.parse(localStorage.getItem("edulita_chat_history") || "[]")
      const newMessage: ChatMessage = {
        ...messageData,
        id: `local-message-${Date.now()}`,
        created_at: new Date().toISOString(),
      }

      chatHistory.push(newMessage)

      // Keep only last 50 messages
      if (chatHistory.length > 50) {
        chatHistory.splice(0, chatHistory.length - 50)
      }

      localStorage.setItem("edulita_chat_history", JSON.stringify(chatHistory))
      console.log("✅ Chat message saved to localStorage")

      // Try to save to Supabase as backup (non-blocking)
      if (shouldUseSupabase()) {
        try {
          console.log("🗄️ Attempting backup save to Supabase...")
          const { data, error } = await supabase.from("chat_messages").insert(messageData).select().single()

          if (error) {
            console.warn("⚠️ Supabase backup save failed (non-critical):", error.message)
          } else {
            console.log("✅ Chat message backed up to database:", data.id)
          }
        } catch (dbError) {
          console.warn("⚠️ Supabase backup save error (non-critical):", dbError)
        }
      }

      return newMessage
    } catch (error) {
      console.error("💥 LocalStorage save failed:", error)

      // Return a fallback message even if save fails
      return {
        ...messageData,
        id: `fallback-message-${Date.now()}`,
        created_at: new Date().toISOString(),
      } as ChatMessage
    }
  },

  async getUserChatHistory(userId: string, limit = 20) {
    console.log("📚 Loading chat history for user:", userId)

    // Always load from localStorage first (most reliable)
    try {
      console.log("📝 Loading from localStorage...")
      const chatHistory = JSON.parse(localStorage.getItem("edulita_chat_history") || "[]")
      const userHistory = chatHistory.filter((msg: ChatMessage) => msg.user_id === userId).slice(-limit) // Get last N messages

      console.log(`✅ Loaded ${userHistory.length} messages from localStorage`)

      // Try to load from Supabase as additional source (non-blocking)
      if (shouldUseSupabase() && userHistory.length === 0) {
        try {
          console.log("🗄️ Attempting to load from Supabase as fallback...")
          const { data, error } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(limit)

          if (error) {
            console.warn("⚠️ Supabase load failed (using localStorage):", error.message)
          } else if (data && data.length > 0) {
            console.log(`✅ Loaded ${data.length} additional messages from database`)

            // Merge with localStorage and save back
            const mergedHistory = [...userHistory, ...data]
            const allHistory = JSON.parse(localStorage.getItem("edulita_chat_history") || "[]")

            // Add new messages to localStorage
            data.forEach((msg) => {
              if (!allHistory.find((existing: ChatMessage) => existing.id === msg.id)) {
                allHistory.push(msg)
              }
            })

            localStorage.setItem("edulita_chat_history", JSON.stringify(allHistory))
            return data as ChatMessage[]
          }
        } catch (dbError) {
          console.warn("⚠️ Supabase load error (using localStorage):", dbError)
        }
      }

      return userHistory as ChatMessage[]
    } catch (error) {
      console.error("💥 Error loading chat history:", error)
      return [] // Return empty array if all fails
    }
  },

  async clearUserChatHistory(userId: string) {
    console.log("🗑️ Clearing chat history for user:", userId)

    try {
      // Clear from localStorage (primary)
      console.log("📝 Clearing localStorage history")
      const chatHistory = JSON.parse(localStorage.getItem("edulita_chat_history") || "[]")
      const filteredHistory = chatHistory.filter((msg: ChatMessage) => msg.user_id !== userId)
      localStorage.setItem("edulita_chat_history", JSON.stringify(filteredHistory))
      console.log("✅ Chat history cleared from localStorage")

      // Try to clear from Supabase (secondary, non-blocking)
      if (shouldUseSupabase()) {
        try {
          console.log("🗄️ Attempting to clear from Supabase...")
          const { error } = await supabase.from("chat_messages").delete().eq("user_id", userId)

          if (error) {
            console.warn("⚠️ Supabase clear failed (non-critical):", error.message)
          } else {
            console.log("✅ Chat history cleared from database")
          }
        } catch (dbError) {
          console.warn("⚠️ Supabase clear error (non-critical):", dbError)
        }
      }
    } catch (error) {
      console.error("💥 Error clearing chat history:", error)
    }
  },
}

// Document operations
export const documentService = {
  async uploadDocument(documentData: Omit<Document, "id" | "created_at" | "updated_at">) {
    if (!shouldUseSupabase()) {
      return {
        ...documentData,
        id: `mock-document-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Document
    }

    try {
      const { data, error } = await supabase.from("documents").insert(documentData).select().single()

      if (error) throw error
      return data as Document
    } catch (error) {
      console.error("Error uploading document:", error)
      throw error
    }
  },

  async getUserDocuments(userId: string) {
    if (!shouldUseSupabase()) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("uploaded_by", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Document[]
    } catch (error) {
      console.error("Error getting user documents:", error)
      return []
    }
  },

  async updateDocumentSummary(documentId: string, summary: string, extractedText?: string) {
    if (!shouldUseSupabase()) {
      return { id: documentId, summary, extracted_text: extractedText } as Document
    }

    try {
      const { data, error } = await supabase
        .from("documents")
        .update({ summary, extracted_text: extractedText })
        .eq("id", documentId)
        .select()
        .single()

      if (error) throw error
      return data as Document
    } catch (error) {
      console.error("Error updating document summary:", error)
      throw error
    }
  },
}

// Assignment operations (keeping existing structure)
export const assignmentService = {
  async getAssignmentsByClass(classId: string) {
    if (!shouldUseSupabase()) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from("assignments")
        .select(`
          *,
          submissions(id, student_id, score, submitted_at)
        `)
        .eq("class_id", classId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error getting assignments:", error)
      return []
    }
  },

  async createAssignment(assignmentData: Omit<Assignment, "id" | "created_at" | "updated_at">) {
    if (!shouldUseSupabase()) {
      return {
        ...assignmentData,
        id: `mock-assignment-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Assignment
    }

    try {
      const { data, error } = await supabase.from("assignments").insert(assignmentData).select().single()

      if (error) throw error
      return data as Assignment
    } catch (error) {
      console.error("Error creating assignment:", error)
      throw error
    }
  },

  async submitAssignment(submissionData: Omit<Submission, "id" | "submitted_at" | "graded_at">) {
    if (!shouldUseSupabase()) {
      return {
        ...submissionData,
        id: `mock-submission-${Date.now()}`,
        submitted_at: new Date().toISOString(),
      } as Submission
    }

    try {
      const { data, error } = await supabase.from("submissions").insert(submissionData).select().single()

      if (error) throw error
      return data as Submission
    } catch (error) {
      console.error("Error submitting assignment:", error)
      throw error
    }
  },

  async gradeSubmission(submissionId: string, score: number, feedback?: string) {
    if (!shouldUseSupabase()) {
      return {
        id: submissionId,
        score,
        feedback,
        graded_at: new Date().toISOString(),
      } as Submission
    }

    try {
      const { data, error } = await supabase
        .from("submissions")
        .update({
          score,
          feedback,
          graded_at: new Date().toISOString(),
        })
        .eq("id", submissionId)
        .select()
        .single()

      if (error) throw error
      return data as Submission
    } catch (error) {
      console.error("Error grading submission:", error)
      throw error
    }
  },
}

// Class operations (keeping existing structure)
export const classService = {
  async getClassesByTeacher(teacherId: string) {
    if (!shouldUseSupabase()) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          school:schools(name),
          assignments(id, title, due_date)
        `)
        .eq("teacher_id", teacherId)

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error getting classes by teacher:", error)
      return []
    }
  },

  async getClassesBySchool(schoolId: string) {
    if (!shouldUseSupabase()) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          teacher:users!classes_teacher_id_fkey(name, email)
        `)
        .eq("school_id", schoolId)

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error getting classes by school:", error)
      return []
    }
  },

  async createClass(classData: Omit<Class, "id" | "created_at" | "updated_at">) {
    if (!shouldUseSupabase()) {
      return {
        ...classData,
        id: `mock-class-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Class
    }

    try {
      const { data, error } = await supabase.from("classes").insert(classData).select().single()

      if (error) throw error
      return data as Class
    } catch (error) {
      console.error("Error creating class:", error)
      throw error
    }
  },
}
