"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Loader2, AlertCircle, Settings, CheckCircle, History, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { chatService } from "@/lib/database"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isError?: boolean
  saved?: boolean
}

interface ChatBotProps {
  userRole: string
}

export function ChatBot({ userRole }: ChatBotProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [apiKeyStatus, setApiKeyStatus] = useState<"checking" | "available" | "missing">("checking")
  const [showHistory, setShowHistory] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      initializeChat()
    }
  }, [user])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const initializeChat = async () => {
    setIsLoadingHistory(true)

    try {
      // Check API key status
      checkApiKeyStatus()

      // Load chat history with error handling
      await loadChatHistory()

      // Add welcome message if no history exists
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: "welcome-" + Date.now(),
          content: getWelcomeMessage(userRole),
          role: "assistant",
          timestamp: new Date(),
          saved: false, // Welcome message doesn't need to be saved
        }
        setMessages([welcomeMessage])
      }
    } catch (error) {
      console.error("Error initializing chat:", error)

      // Always show welcome message even if initialization fails
      const welcomeMessage: Message = {
        id: "welcome-" + Date.now(),
        content: getWelcomeMessage(userRole),
        role: "assistant",
        timestamp: new Date(),
        saved: false,
      }
      setMessages([welcomeMessage])
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const loadChatHistory = async () => {
    if (!user) return

    try {
      console.log("📚 Loading chat history for user:", user.id)
      const history = await chatService.getUserChatHistory(user.id, 20)

      if (history && history.length > 0) {
        const historyMessages: Message[] = []

        // Convert database records to message pairs
        history.reverse().forEach((record) => {
          // Add user message
          historyMessages.push({
            id: `user-${record.id}`,
            content: record.message,
            role: "user",
            timestamp: new Date(record.created_at),
            saved: true,
          })

          // Add assistant response
          historyMessages.push({
            id: `assistant-${record.id}`,
            content: record.response,
            role: "assistant",
            timestamp: new Date(record.created_at),
            saved: true,
          })
        })

        setMessages(historyMessages)
        console.log(`✅ Loaded ${historyMessages.length} messages from history`)
      } else {
        console.log("📝 No chat history found, starting fresh")
      }
    } catch (error) {
      console.warn("⚠️ Error loading chat history (non-critical):", error)
      // Continue without history if loading fails - don't break the chat
    }
  }

  const clearChatHistory = async () => {
    if (!user) return

    try {
      await chatService.clearUserChatHistory(user.id)
      setMessages([
        {
          id: "welcome-" + Date.now(),
          content: getWelcomeMessage(userRole),
          role: "assistant",
          timestamp: new Date(),
          saved: false,
        },
      ])
      console.log("🗑️ Chat history cleared")
    } catch (error) {
      console.error("Error clearing chat history:", error)
    }
  }

  const checkApiKeyStatus = () => {
    try {
      // Check both possible locations for the API key
      const googleApiKey =
        process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY ||
        process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
        (typeof window !== "undefined" && (window as any).process?.env?.GOOGLE_GENERATIVE_AI_API_KEY)

      const hasGoogleAI =
        googleApiKey &&
        googleApiKey !== "your-google-ai-api-key-here" &&
        googleApiKey.startsWith("AIza") &&
        googleApiKey.length > 30

      console.log("🔍 Checking API key status:", {
        hasKey: !!googleApiKey,
        keyLength: googleApiKey?.length,
        startsWithAIza: googleApiKey?.startsWith("AIza"),
        isValid: hasGoogleAI,
        keyPreview: googleApiKey ? `${googleApiKey.substring(0, 8)}...` : "none",
      })

      if (hasGoogleAI) {
        setApiKeyStatus("available")
        console.log("✅ Google AI API key is properly configured")
      } else {
        setApiKeyStatus("missing")
        console.log("⚠️ Google AI API key is missing or invalid")

        // Add configuration message if API key is missing and no history loaded
        if (messages.length <= 1) {
          const configMessage: Message = {
            id: "config-" + Date.now(),
            content: getConfigurationMessage(),
            role: "assistant",
            timestamp: new Date(),
            isError: true,
            saved: false,
          }
          setMessages((prev) => {
            const hasConfigMessage = prev.some((msg) => msg.isError && msg.content.includes("Mode Demo Aktif"))
            if (!hasConfigMessage) {
              return [...prev, configMessage]
            }
            return prev
          })
        }
      }
    } catch (error) {
      console.error("Error checking API key status:", error)
      setApiKeyStatus("missing")
    }
  }

  const generateAIResponse = async (prompt: string): Promise<string> => {
    try {
      // Dynamic import to avoid loading issues
      const { generateText } = await import("ai")
      const { google } = await import("@ai-sdk/google")

      const systemPrompt = getSystemPrompt(userRole)

      console.log("🤖 Generating AI response with Gemini...")

      const { text } = await generateText({
        model: google("gemini-1.5-flash"),
        system: systemPrompt,
        prompt: prompt,
        maxTokens: 1000,
        temperature: 0.7,
      })

      console.log("✅ AI response generated successfully")
      return text
    } catch (error) {
      console.error("AI generation error:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
      saved: false,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      let responseText: string

      // Check if Google AI API key is available and try to use it
      if (apiKeyStatus === "available") {
        try {
          responseText = await generateAIResponse(currentInput)
          console.log("✅ Using Google Gemini AI response")
        } catch (aiError) {
          console.error("Google AI error:", aiError)
          // Fallback to mock response if AI fails
          responseText = generateMockResponse(currentInput, userRole)
          console.log("⚠️ Fallback to mock response due to AI error")
        }
      } else {
        // Use mock response if API key is not configured
        responseText = generateMockResponse(currentInput, userRole)
        console.log("ℹ️ Using mock response (API key not configured)")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: "assistant",
        timestamp: new Date(),
        saved: false,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Save conversation to database/localStorage with error handling
      try {
        console.log("💾 Saving chat message...")
        const savedMessage = await chatService.saveChatMessage({
          user_id: user.id,
          message: currentInput,
          response: responseText,
          context: {
            userRole,
            timestamp: new Date().toISOString(),
            model: apiKeyStatus === "available" ? "gemini-1.5-flash" : "mock",
            apiKeyStatus,
          },
        })

        // Mark messages as saved
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === userMessage.id || msg.id === assistantMessage.id) {
              return { ...msg, saved: true }
            }
            return msg
          }),
        )

        console.log("✅ Chat message saved successfully:", savedMessage.id)
      } catch (dbError) {
        console.warn("⚠️ Save failed (non-critical, chat continues):", dbError)

        // Show save error indicator but don't break the chat
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === userMessage.id || msg.id === assistantMessage.id) {
              return { ...msg, saved: false }
            }
            return msg
          }),
        )
      }
    } catch (error) {
      console.error("Error in chat:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Maaf, terjadi kesalahan sistem. Saya akan tetap mencoba membantu Anda dengan kemampuan terbatas.",
        role: "assistant",
        timestamp: new Date(),
        isError: true,
        saved: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfigureAPI = () => {
    const configInstructions: Message = {
      id: "config-instructions-" + Date.now(),
      content: `Untuk mengaktifkan AI yang lebih canggih, ikuti langkah berikut:

1. 🌐 Buka https://makersuite.google.com/app/apikey
2. 🔐 Login dengan akun Google Anda
3. ➕ Klik "Create API Key"
4. 📋 Copy API key yang dihasilkan
5. ✏️ Edit file .env.local di project Anda
6. 🔧 Ganti "your-google-ai-api-key-here" dengan API key asli
7. 🔄 Restart server dengan: npm run dev

Setelah itu, saya akan dapat memberikan respons yang lebih cerdas dan kontekstual!`,
      role: "assistant",
      timestamp: new Date(),
      saved: false,
    }
    setMessages((prev) => [...prev, configInstructions])
  }

  const testApiKey = async () => {
    if (apiKeyStatus !== "available") {
      const testMessage: Message = {
        id: "test-" + Date.now(),
        content: "API key belum dikonfigurasi dengan benar. Silakan periksa file .env.local Anda.",
        role: "assistant",
        timestamp: new Date(),
        isError: true,
        saved: false,
      }
      setMessages((prev) => [...prev, testMessage])
      return
    }

    setIsLoading(true)
    try {
      const testResponse = await generateAIResponse("Halo, ini adalah test koneksi API. Tolong balas dengan singkat.")

      const testMessage: Message = {
        id: "test-success-" + Date.now(),
        content: `🎉 **Test API Berhasil!**\n\nGoogle Gemini AI Response: ${testResponse}\n\nAPI key Anda berfungsi dengan baik!`,
        role: "assistant",
        timestamp: new Date(),
        saved: false,
      }
      setMessages((prev) => [...prev, testMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: "test-error-" + Date.now(),
        content: `❌ **Test API Gagal**\n\nError: ${error}\n\nSilakan periksa API key Anda atau coba restart server.`,
        role: "assistant",
        timestamp: new Date(),
        isError: true,
        saved: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingHistory) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Memuat riwayat chat...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Edulita AI Assistant
          {apiKeyStatus === "available" ? (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Powered by Gemini
            </span>
          ) : (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Demo Mode</span>
          )}
          {/* Chat History Controls */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)} className="text-xs">
              <History className="h-4 w-4 mr-1" />
              {messages.filter((m) => m.saved).length} tersimpan
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChatHistory}
              className="text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>

        {apiKeyStatus === "missing" && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>AI terbatas - konfigurasi Google AI untuk fitur lengkap</span>
            <Button variant="ghost" size="sm" onClick={handleConfigureAPI} className="ml-auto">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        )}

        {apiKeyStatus === "available" && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span>Google Gemini AI aktif dan siap digunakan</span>
            <Button variant="ghost" size="sm" onClick={testApiKey} className="ml-auto">
              Test API
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[80%] rounded-lg p-3 relative ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : message.isError
                        ? "bg-amber-50 text-amber-900 border border-amber-200"
                        : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {/* Save status indicator */}
                    {message.role === "user" && (
                      <span className="text-xs opacity-70 ml-2">
                        {message.saved === true ? "✓" : message.saved === false && message.isError ? "✗" : "⏳"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan Anda..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              {apiKeyStatus === "available"
                ? "Didukung oleh Google Gemini AI - Siap memberikan respons cerdas!"
                : "Mode demo - konfigurasi Google AI untuk fitur lengkap"}
            </p>
            <p className="text-xs text-gray-400">{messages.filter((m) => m.saved).length} pesan tersimpan</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getWelcomeMessage(userRole: string): string {
  const messages = {
    student:
      "Halo! Saya Edulita AI, asisten belajar Anda. Saya siap membantu menjawab pertanyaan materi pelajaran, memberikan kuis, atau membantu menyusun esai. Apa yang ingin Anda pelajari hari ini?",
    teacher:
      "Selamat datang! Saya Edulita AI, asisten mengajar Anda. Saya dapat membantu menyusun rubrik asesmen, modul pembelajaran, menganalisis hasil belajar siswa, dan memberikan rekomendasi strategi pembelajaran. Bagaimana saya bisa membantu Anda?",
    principal:
      "Halo! Saya Edulita AI untuk kepala sekolah. Saya dapat membantu menganalisis data rapor pendidikan, memberikan rekomendasi kebijakan, dan menyajikan visualisasi data sekolah. Apa yang ingin Anda analisis?",
    department:
      "Selamat datang! Saya Edulita AI untuk dinas pendidikan. Saya siap membantu menganalisis data pendidikan daerah, simulasi kebijakan, dan memberikan rekomendasi peningkatan mutu pendidikan. Bagaimana saya bisa membantu?",
    industry:
      "Halo! Saya Edulita AI untuk mitra industri. Saya dapat membantu menganalisis keterserapan alumni dan memberikan insight untuk kerjasama pendidikan-industri. Apa yang ingin Anda ketahui?",
    superadmin:
      "Selamat datang, Admin! Saya Edulita AI dengan akses penuh sistem. Saya dapat membantu analisis komprehensif, manajemen data, dan monitoring seluruh platform. Bagaimana saya bisa membantu?",
  }

  return messages[userRole as keyof typeof messages] || messages.student
}

function getConfigurationMessage(): string {
  return `🔧 **Mode Demo Aktif**

Saya saat ini berjalan dalam mode demo dengan kemampuan terbatas. Untuk mengaktifkan AI yang lebih canggih dengan Google Gemini:

1. Dapatkan API key dari Google AI Studio
2. Konfigurasi di file .env.local
3. Restart aplikasi

Meskipun begitu, saya tetap bisa membantu Anda dengan respons dasar! Silakan ajukan pertanyaan.`
}

function generateMockResponse(input: string, userRole: string): string {
  const lowerInput = input.toLowerCase()

  // Educational responses based on common topics
  if (lowerInput.includes("matematika") || lowerInput.includes("math")) {
    return `Matematika adalah ilmu yang mempelajari pola, struktur, dan hubungan logis. Beberapa cabang utama matematika meliputi:

• **Aljabar** - mempelajari simbol dan aturan manipulasi simbol
• **Geometri** - mempelajari bentuk, ukuran, dan sifat ruang
• **Kalkulus** - mempelajari perubahan dan akumulasi
• **Statistika** - mempelajari pengumpulan dan analisis data

Apakah ada topik matematika spesifik yang ingin Anda pelajari lebih lanjut?`
  }

  if (lowerInput.includes("fisika") || lowerInput.includes("physics")) {
    return `Fisika adalah ilmu yang mempelajari materi, energi, dan interaksinya. Konsep dasar fisika meliputi:

• **Mekanika** - gerak dan gaya
• **Termodinamika** - panas dan energi
• **Elektromagnetisme** - listrik dan magnet
• **Optik** - cahaya dan gelombang
• **Fisika Modern** - relativitas dan mekanika kuantum

Hukum-hukum fisika membantu kita memahami bagaimana alam semesta bekerja. Ada topik fisika tertentu yang ingin Anda bahas?`
  }

  if (lowerInput.includes("kimia") || lowerInput.includes("chemistry")) {
    return `Kimia adalah ilmu yang mempelajari komposisi, struktur, sifat, dan perubahan materi. Cabang utama kimia:

• **Kimia Anorganik** - senyawa non-karbon
• **Kimia Organik** - senyawa karbon
• **Kimia Fisik** - sifat fisik dan kimia
• **Biokimia** - proses kimia dalam makhluk hidup
• **Kimia Analitik** - identifikasi dan kuantifikasi materi

Konsep penting: atom, molekul, ikatan kimia, dan reaksi kimia. Apa aspek kimia yang ingin Anda pelajari?`
  }

  if (lowerInput.includes("biologi") || lowerInput.includes("biology")) {
    return `Biologi adalah ilmu yang mempelajari kehidupan dan organisme hidup. Cabang utama biologi:

• **Botani** - tumbuhan
• **Zoologi** - hewan
• **Mikrobiologi** - mikroorganisme
• **Genetika** - hereditas dan variasi
• **Ekologi** - interaksi organisme dengan lingkungan

Konsep dasar: sel, evolusi, genetika, homeostasis, dan energi. Topik biologi mana yang menarik bagi Anda?`
  }

  if (lowerInput.includes("sejarah") || lowerInput.includes("history")) {
    return `Sejarah adalah studi tentang peristiwa masa lalu dan dampaknya terhadap masa kini. Sejarah Indonesia mencakup:

• **Masa Prasejarah** - sebelum tulisan
• **Masa Hindu-Buddha** - kerajaan klasik
• **Masa Islam** - penyebaran Islam
• **Masa Kolonial** - penjajahan Eropa
• **Masa Kemerdekaan** - perjuangan dan pembangunan

Mempelajari sejarah membantu kita memahami identitas bangsa dan belajar dari pengalaman masa lalu. Periode sejarah mana yang ingin Anda ketahui lebih dalam?`
  }

  if (lowerInput.includes("bahasa") || lowerInput.includes("language")) {
    return `Bahasa adalah sistem komunikasi yang menggunakan simbol, suara, atau gerakan. Dalam pembelajaran bahasa:

• **Tata Bahasa** - aturan struktur kalimat
• **Kosakata** - perbendaharaan kata
• **Fonologi** - sistem bunyi
• **Semantik** - makna kata dan kalimat
• **Pragmatik** - penggunaan bahasa dalam konteks

Bahasa Indonesia memiliki struktur yang khas dengan sistem imbuhan yang kaya. Aspek bahasa mana yang ingin Anda pelajari?`
  }

  // Role-specific responses for teachers
  if (userRole === "teacher") {
    if (lowerInput.includes("rubrik") || lowerInput.includes("asesmen") || lowerInput.includes("penilaian")) {
      return `Sebagai guru, membuat rubrik asesmen yang efektif sangat penting. Berikut panduan membuat rubrik:

**Komponen Rubrik:**
• **Kriteria** - aspek yang dinilai (pengetahuan, keterampilan, sikap)
• **Level Kinerja** - tingkatan pencapaian (sangat baik, baik, cukup, kurang)
• **Deskriptor** - penjelasan detail setiap level
• **Skor/Bobot** - nilai numerik untuk setiap level

**Tips Membuat Rubrik:**
• Selaraskan dengan tujuan pembelajaran
• Gunakan bahasa yang jelas dan spesifik
• Libatkan siswa dalam memahami kriteria
• Uji coba dan revisi berdasarkan pengalaman

Apakah Anda ingin bantuan untuk mata pelajaran atau topik tertentu?`
    }

    if (lowerInput.includes("strategi") || lowerInput.includes("metode") || lowerInput.includes("mengajar")) {
      return `Strategi pembelajaran yang efektif untuk guru modern:

**Pembelajaran Aktif:**
• **Think-Pair-Share** - berpikir, berpasangan, berbagi
• **Problem-Based Learning** - pembelajaran berbasis masalah
• **Project-Based Learning** - pembelajaran berbasis proyek
• **Cooperative Learning** - pembelajaran kooperatif

**Diferensiasi Pembelajaran:**
• Sesuaikan dengan gaya belajar siswa
• Berikan pilihan aktivitas yang beragam
• Gunakan teknologi sebagai alat bantu
• Berikan feedback yang konstruktif

**Manajemen Kelas:**
• Ciptakan lingkungan belajar yang positif
• Tetapkan aturan yang jelas dan konsisten
• Gunakan teknik motivasi yang bervariasi

Tantangan mengajar apa yang sedang Anda hadapi?`
    }

    return `Sebagai guru, Anda memiliki peran penting dalam membentuk masa depan siswa. Beberapa area yang bisa saya bantu:

• **Perencanaan Pembelajaran** - RPP, silabus, dan materi
• **Strategi Mengajar** - metode dan teknik pembelajaran
• **Asesmen dan Evaluasi** - rubrik, soal, dan penilaian
• **Manajemen Kelas** - disiplin dan motivasi siswa
• **Teknologi Pendidikan** - integrasi digital dalam pembelajaran
• **Pengembangan Profesional** - pelatihan dan sertifikasi

Aspek mana yang ingin Anda diskusikan lebih lanjut?`
  }

  if (userRole === "principal") {
    if (lowerInput.includes("mutu") || lowerInput.includes("kualitas") || lowerInput.includes("peningkatan")) {
      return `Sebagai kepala sekolah, peningkatan mutu pendidikan adalah prioritas utama. Strategi yang dapat diterapkan:

**Peningkatan Mutu Pembelajaran:**
• **Supervisi Akademik** - monitoring dan coaching guru
• **Pengembangan Kurikulum** - adaptasi dengan kebutuhan lokal
• **Fasilitas Pembelajaran** - sarana dan prasarana memadai
• **Evaluasi Berkelanjutan** - monitoring progress siswa

**Manajemen SDM:**
• **Pelatihan Guru** - workshop dan seminar berkala
• **Motivasi dan Apresiasi** - reward system untuk prestasi
• **Kolaborasi Tim** - budaya kerja sama yang kuat
• **Rekrutmen Berkualitas** - seleksi guru yang kompeten

**Kemitraan Strategis:**
• **Orang Tua** - komunikasi dan keterlibatan aktif
• **Komunitas** - dukungan masyarakat sekitar
• **Industri** - program magang dan kerjasama

Program mana yang ingin Anda prioritaskan di sekolah Anda?`
    }

    return `Sebagai kepala sekolah, Anda memimpin transformasi pendidikan. Area yang bisa saya bantu:

• **Kepemimpinan Pembelajaran** - visi dan strategi pendidikan
• **Manajemen Sekolah** - operasional dan administrasi
• **Pengembangan SDM** - pelatihan dan motivasi guru
• **Budaya Sekolah** - lingkungan pembelajaran positif
• **Kemitraan** - kolaborasi dengan stakeholder
• **Evaluasi dan Monitoring** - sistem penjaminan mutu

Aspek manajemen sekolah mana yang ingin Anda bahas?`
  }

  // General educational response
  return `Terima kasih atas pertanyaan Anda tentang "${input}". 

Saya akan berusaha membantu dengan kemampuan terbatas dalam mode demo ini. Untuk mendapatkan respons yang lebih mendalam dan kontekstual, silakan konfigurasi Google AI API key.

Beberapa hal yang bisa saya bantu:
• Penjelasan konsep dasar berbagai mata pelajaran
• Tips belajar dan mengajar yang efektif
• Informasi umum tentang pendidikan Indonesia
• Panduan penggunaan platform ini
• Strategi pembelajaran dan asesmen

Apakah ada topik spesifik yang ingin Anda pelajari lebih lanjut?`
}

function getSystemPrompt(userRole: string): string {
  const basePrompt =
    "Anda adalah Edulita AI, chatbot edukatif yang didukung oleh Google Gemini. Anda sopan, kontekstual, dan edukatif. Berikan respons yang mudah dipahami dan relevan dengan kebutuhan pendidikan Indonesia. Gunakan bahasa Indonesia yang baik dan benar."

  const roleSpecificPrompts = {
    student: `${basePrompt} Anda membantu siswa dengan:
    - Menjelaskan materi pelajaran dengan contoh sehari-hari yang mudah dipahami
    - Memberikan soal latihan dan feedback yang konstruktif
    - Membantu menyusun esai dan refleksi belajar
    - Memberikan tips belajar efektif sesuai gaya belajar
    - Menjawab dengan bahasa yang mudah dipahami siswa
    - Memberikan motivasi dan dukungan dalam belajar`,

    teacher: `${basePrompt} Anda membantu guru dengan:
    - Menyusun rubrik asesmen yang komprehensif dan modul pembelajaran
    - Menganalisis hasil belajar siswa dengan pendekatan data-driven
    - Memberikan rekomendasi strategi pembelajaran yang inovatif
    - Membantu perencanaan kurikulum yang sesuai dengan standar nasional
    - Menyediakan ide aktivitas pembelajaran kreatif dan interaktif
    - Memberikan solusi untuk tantangan mengajar di kelas`,

    principal: `${basePrompt} Anda membantu kepala sekolah dengan:
    - Menganalisis data rapor pendidikan sekolah secara mendalam
    - Memberikan rekomendasi kebijakan sekolah berbasis data
    - Membantu perencanaan strategis sekolah jangka pendek dan panjang
    - Analisis kinerja guru dan siswa untuk peningkatan mutu
    - Rekomendasi program peningkatan mutu pendidikan
    - Strategi manajemen sekolah yang efektif`,

    department: `${basePrompt} Anda membantu dinas pendidikan dengan:
    - Menganalisis data pendidikan daerah secara komprehensif
    - Simulasi dampak kebijakan pendidikan terhadap mutu
    - Rekomendasi program intervensi yang tepat sasaran
    - Analisis keterserapan alumni dan link and match
    - Perencanaan anggaran pendidikan yang optimal
    - Strategi peningkatan mutu pendidikan daerah`,

    industry: `${basePrompt} Anda membantu mitra industri dengan:
    - Analisis keterserapan alumni dan kesesuaian kompetensi
    - Rekomendasi program magang dan kerjasama industri-sekolah
    - Insight kebutuhan kompetensi industri masa depan
    - Evaluasi program link and match yang efektif
    - Strategi pengembangan SDM berkelanjutan
    - Perencanaan kerjasama jangka panjang dengan institusi pendidikan`,

    superadmin: `${basePrompt} Anda memiliki akses penuh untuk:
    - Analisis komprehensif seluruh sistem pendidikan
    - Monitoring dan evaluasi platform secara menyeluruh
    - Rekomendasi pengembangan fitur dan sistem
    - Analisis data lintas role dan institusi
    - Manajemen dan optimasi sistem secara keseluruhan
    - Perencanaan strategis pengembangan platform`,
  }

  return roleSpecificPrompts[userRole as keyof typeof roleSpecificPrompts] || roleSpecificPrompts.student
}
