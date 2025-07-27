"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatBot } from "@/components/chatbot/chatbot"
import { useAuth } from "@/hooks/use-auth"
import {
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  MessageSquare,
  FileText,
  TrendingUp,
  Award,
  Target,
  LogOut,
  Plus,
  Download,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
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

  const classData = [
    { class: "X IPA 1", students: 32, avgScore: 85.2, completion: 78 },
    { class: "X IPA 2", students: 30, avgScore: 82.7, completion: 85 },
    { class: "XI IPA 1", students: 28, avgScore: 88.1, completion: 92 },
  ]

  const recentAssignments = [
    { title: "Kuis Hukum Newton", class: "X IPA 1", submitted: 28, total: 32, avgScore: 87 },
    { title: "Tugas Aljabar Linear", class: "X IPA 2", submitted: 25, total: 30, avgScore: 82 },
    { title: "Praktikum Kimia", class: "XI IPA 1", submitted: 26, total: 28, avgScore: 90 },
  ]

  // Mock data for new features
  const rubrics = [
    { id: 1, title: "Rubrik Presentasi", subject: "Matematika", status: "active", lastUsed: "2024-01-15" },
    { id: 2, title: "Rubrik Praktikum", subject: "Fisika", status: "draft", lastUsed: "2024-01-10" },
    { id: 3, title: "Rubrik Essay", subject: "Bahasa Indonesia", status: "active", lastUsed: "2024-01-12" },
  ]

  const jobsheets = [
    { id: 1, title: "Jobsheet Hukum Newton", class: "X IPA 1", downloads: 28, status: "published" },
    { id: 2, title: "Jobsheet Aljabar", class: "X IPA 2", downloads: 25, status: "published" },
    { id: 3, title: "Jobsheet Kimia Organik", class: "XI IPA 1", downloads: 30, status: "draft" },
  ]

  const studentAnalysis = [
    {
      name: "Ahmad Rizki",
      class: "X IPA 1",
      avgScore: 92,
      trend: "up",
      status: "excellent",
      recommendation: "Berikan tantangan lebih",
    },
    {
      name: "Siti Nurhaliza",
      class: "X IPA 1",
      avgScore: 65,
      trend: "down",
      status: "needs_attention",
      recommendation: "Perlu bimbingan khusus",
    },
    {
      name: "Budi Santoso",
      class: "X IPA 2",
      avgScore: 78,
      trend: "stable",
      status: "good",
      recommendation: "Pertahankan konsistensi",
    },
    {
      name: "Maya Sari",
      class: "XI IPA 1",
      avgScore: 88,
      trend: "up",
      status: "very_good",
      recommendation: "Kembangkan potensi lebih",
    },
  ]

  const reports = [
    {
      title: "Laporan Bulanan Januari",
      type: "monthly",
      class: "Semua Kelas",
      date: "2024-01-31",
      status: "completed",
    },
    { title: "Analisis Capaian Semester", type: "semester", class: "X IPA 1", date: "2024-01-15", status: "completed" },
    { title: "Refleksi Pembelajaran", type: "reflection", class: "X IPA 2", date: "2024-01-20", status: "draft" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
              <p className="text-gray-600">Kelola pembelajaran dan pantau progress siswa</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Guru Matematika
              </Badge>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Siswa</p>
                <p className="text-xl font-bold text-blue-600">90</p>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="rubric" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Rubrik & Jobsheet
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analisis Siswa
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Laporan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">90 siswa total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tugas Aktif</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Menunggu penilaian</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85.3</div>
                  <p className="text-xs text-muted-foreground">+2.1 dari bulan lalu</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tingkat Kehadiran</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94%</div>
                  <p className="text-xs text-muted-foreground">Minggu ini</p>
                </CardContent>
              </Card>
            </div>

            {/* Class Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overview Kelas</CardTitle>
                  <CardDescription>Ringkasan performa setiap kelas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {classData.map((classItem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{classItem.class}</h4>
                        <p className="text-sm text-gray-600">{classItem.students} siswa</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Completion Rate</span>
                            <span>{classItem.completion}%</span>
                          </div>
                          <Progress value={classItem.completion} className="h-2" />
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-blue-600">{classItem.avgScore}</p>
                        <p className="text-xs text-gray-500">Rata-rata</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tugas Terbaru</CardTitle>
                  <CardDescription>Status pengumpulan tugas siswa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentAssignments.map((assignment, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{assignment.title}</h4>
                        <Badge variant="outline">{assignment.class}</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>
                          Terkumpul: {assignment.submitted}/{assignment.total}
                        </span>
                        <span>Rata-rata: {assignment.avgScore}</span>
                      </div>
                      <Progress value={(assignment.submitted / assignment.total) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <div className="max-w-4xl mx-auto">
              <ChatBot userRole="teacher" />
            </div>
          </TabsContent>

          <TabsContent value="rubric" className="space-y-6">
            {/* Rubrik Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      Rubrik Asesmen
                    </CardTitle>
                    <CardDescription>Kelola rubrik penilaian untuk berbagai jenis tugas</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Buat Rubrik Baru
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rubrics.map((rubric) => (
                    <div key={rubric.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{rubric.title}</h4>
                          <Badge variant={rubric.status === "active" ? "default" : "secondary"}>
                            {rubric.status === "active" ? "Aktif" : "Draft"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>Mata Pelajaran: {rubric.subject}</span>
                          <span className="mx-2">•</span>
                          <span>Terakhir digunakan: {rubric.lastUsed}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Jobsheet Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Jobsheet & Modul
                    </CardTitle>
                    <CardDescription>Kelola jobsheet dan modul pembelajaran</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Buat Jobsheet Baru
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobsheets.map((jobsheet) => (
                    <div key={jobsheet.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{jobsheet.title}</h4>
                          <Badge variant={jobsheet.status === "published" ? "default" : "secondary"}>
                            {jobsheet.status === "published" ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>Kelas: {jobsheet.class}</span>
                          <span className="mx-2">•</span>
                          <span>{jobsheet.downloads} downloads</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analisis Hasil Belajar Siswa
                </CardTitle>
                <CardDescription>Analisis mendalam performa siswa dengan rekomendasi intervensi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentAnalysis.map((student, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{student.name}</h4>
                          <Badge variant="outline">{student.class}</Badge>
                          <Badge
                            variant={
                              student.status === "excellent"
                                ? "default"
                                : student.status === "very_good"
                                  ? "default"
                                  : student.status === "good"
                                    ? "secondary"
                                    : "destructive"
                            }
                          >
                            {student.status === "excellent"
                              ? "Sangat Baik"
                              : student.status === "very_good"
                                ? "Baik Sekali"
                                : student.status === "good"
                                  ? "Baik"
                                  : "Perlu Perhatian"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{student.avgScore}</span>
                          {student.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {student.trend === "down" && <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />}
                          {student.trend === "stable" && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                        </div>
                      </div>
                      <div className="mb-3">
                        <Progress value={student.avgScore} className="h-2" />
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Rekomendasi:</p>
                          <p className="text-sm text-blue-700">{student.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Class Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Siswa Berprestasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                  <p className="text-sm text-gray-600">Nilai di atas 85</p>
                  <Progress value={40} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Perlu Bimbingan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2">8</div>
                  <p className="text-sm text-gray-600">Nilai 60-75</p>
                  <Progress value={27} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Perlu Perhatian Khusus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-2">3</div>
                  <p className="text-sm text-gray-600">Nilai di bawah 60</p>
                  <Progress value={10} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Laporan Capaian & Refleksi
                    </CardTitle>
                    <CardDescription>Generate dan kelola laporan pembelajaran otomatis</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Buat Laporan Baru
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{report.title}</h4>
                          <Badge variant={report.status === "completed" ? "default" : "secondary"}>
                            {report.status === "completed" ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Selesai
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Draft
                              </>
                            )}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>
                            Jenis:{" "}
                            {report.type === "monthly"
                              ? "Bulanan"
                              : report.type === "semester"
                                ? "Semester"
                                : "Refleksi"}
                          </span>
                          <span className="mx-2">•</span>
                          <span>Kelas: {report.class}</span>
                          <span className="mx-2">•</span>
                          <span>Tanggal: {report.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Report Generation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Laporan Bulanan</CardTitle>
                  <CardDescription>Generate laporan progress bulanan</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Laporan
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg">Analisis Capaian</CardTitle>
                  <CardDescription>Laporan capaian pembelajaran</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Analisis
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg">Refleksi Kelas</CardTitle>
                  <CardDescription>Refleksi pembelajaran dan evaluasi</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Buat Refleksi
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
