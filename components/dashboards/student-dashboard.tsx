"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatBot } from "@/components/chatbot/chatbot"
import { QuizGenerator } from "@/components/quiz/quiz-generator"
import { FileUpload } from "@/components/file-upload/file-upload"
import { useAuth } from "@/hooks/use-auth"
import { studentService } from "@/lib/database"
import {
  BookOpen,
  Brain,
  Upload,
  MessageSquare,
  TrendingUp,
  Award,
  Target,
  Clock,
  CheckCircle,
  LogOut,
} from "lucide-react"

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [studentStats, setStudentStats] = useState({
    totalQuizzes: 0,
    averageQuizScore: 0,
    totalAssignments: 0,
    averageAssignmentScore: 0,
    overallAverage: 0,
  })
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  useEffect(() => {
    const loadStudentStats = async () => {
      if (user?.id) {
        try {
          const stats = await studentService.getStudentStats(user.id)
          setStudentStats(stats)
        } catch (error) {
          console.error("Error loading student stats:", error)
        }
      }
    }

    loadStudentStats()
  }, [user?.id])

  const recentActivities = [
    { type: "quiz", title: "Kuis Matematika Dasar", score: 85, date: "2024-01-15", status: "completed" },
    { type: "assignment", title: "Tugas Fisika", score: 90, date: "2024-01-14", status: "completed" },
    { type: "quiz", title: "Kuis Bahasa Indonesia", score: 78, date: "2024-01-13", status: "completed" },
    { type: "assignment", title: "Essay Sejarah", score: null, date: "2024-01-16", status: "pending" },
  ]

  const upcomingTasks = [
    { title: "Kuis Kimia", subject: "Kimia", dueDate: "2024-01-20", type: "quiz" },
    { title: "Presentasi Biologi", subject: "Biologi", dueDate: "2024-01-22", type: "presentation" },
    { title: "Tugas Matematika", subject: "Matematika", dueDate: "2024-01-25", type: "assignment" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Siswa</h1>
              <p className="text-gray-600">Selamat datang, {user?.name || "Siswa"}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Kelas X IPA 1
              </Badge>
              <div className="text-right">
                <p className="text-sm text-gray-600">Rata-rata Nilai</p>
                <p className="text-xl font-bold text-green-600">{studentStats.overallAverage.toFixed(1)}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Tutor
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Kuis Adaptif
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Dokumen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Kuis</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentStats.totalQuizzes}</div>
                  <p className="text-xs text-muted-foreground">Diselesaikan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rata-rata Kuis</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentStats.averageQuizScore.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Skor kuis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentStats.totalAssignments}</div>
                  <p className="text-xs text-muted-foreground">Dikumpulkan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rata-rata Tugas</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentStats.averageAssignmentScore.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Skor tugas</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities and Upcoming Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>Kuis dan tugas yang baru diselesaikan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {activity.type === "quiz" ? (
                          <Brain className="h-5 w-5 text-blue-600" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-green-600" />
                        )}
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.status === "completed" ? (
                          <>
                            <div className="text-lg font-bold text-green-600">{activity.score}</div>
                            <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                          </>
                        ) : (
                          <>
                            <div className="text-sm text-orange-600">Pending</div>
                            <Clock className="h-4 w-4 text-orange-600 mx-auto" />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tugas Mendatang</CardTitle>
                  <CardDescription>Deadline tugas dan kuis yang akan datang</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {task.type === "quiz" ? (
                          <Brain className="h-5 w-5 text-blue-600" />
                        ) : task.type === "presentation" ? (
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-green-600" />
                        )}
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-gray-600">{task.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{task.dueDate}</div>
                        <Badge variant="outline" className="text-xs">
                          {task.type === "quiz" ? "Kuis" : task.type === "presentation" ? "Presentasi" : "Tugas"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Pembelajaran</CardTitle>
                <CardDescription>Ringkasan kemajuan belajar per mata pelajaran</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { subject: "Matematika", progress: 85, score: 87.5 },
                    { subject: "Fisika", progress: 78, score: 82.3 },
                    { subject: "Kimia", progress: 92, score: 89.1 },
                    { subject: "Biologi", progress: 88, score: 85.7 },
                  ].map((subject, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{subject.subject}</span>
                          <span className="text-sm text-gray-600">Nilai: {subject.score}</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <div className="max-w-4xl mx-auto">
              <ChatBot userRole="student" />
            </div>
          </TabsContent>

          <TabsContent value="quiz">
            <div className="max-w-4xl mx-auto">
              <QuizGenerator />
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="max-w-4xl mx-auto">
              <FileUpload />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
