"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatBot } from "@/components/chatbot/chatbot"
import {
  School,
  Users,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Settings,
  Award,
  Target,
  BookOpen,
  LogOut,
  FileText,
  Activity,
  PieChart,
  LineChart,
} from "lucide-react"

export function PrincipalDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const schoolStats = {
    totalStudents: 1250,
    totalTeachers: 45,
    totalClasses: 36,
    averageScore: 82.5,
    attendanceRate: 94.2,
    graduationRate: 98.5,
  }

  const departmentData = [
    { name: "Matematika", teachers: 8, students: 1250, avgScore: 85.2, trend: "+2.1" },
    { name: "IPA", teachers: 12, students: 800, avgScore: 83.7, trend: "+1.8" },
    { name: "IPS", teachers: 10, students: 450, avgScore: 81.4, trend: "+0.9" },
    { name: "Bahasa", teachers: 15, students: 1250, avgScore: 84.1, trend: "+1.5" },
  ]

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

  // Mock data for analytics
  const reportCardData = {
    subjects: [
      { name: "Matematika", score: 85.2, national: 78.5, status: "above" },
      { name: "Bahasa Indonesia", score: 87.1, national: 82.3, status: "above" },
      { name: "Bahasa Inggris", score: 79.8, national: 75.2, status: "above" },
      { name: "IPA", score: 83.7, national: 80.1, status: "above" },
      { name: "IPS", score: 81.4, national: 79.8, status: "above" },
    ],
    trends: {
      literacy: { current: 85.2, previous: 82.1, change: "+3.1" },
      numeracy: { current: 83.7, previous: 81.5, change: "+2.2" },
      character: { current: 88.9, previous: 87.2, change: "+1.7" },
    },
  }

  const policyScenarios = [
    {
      title: "Peningkatan Jam Belajar",
      description: "Menambah 2 jam pelajaran per hari",
      impact: {
        academic: "+8%",
        attendance: "+5%",
        satisfaction: "-3%",
      },
    },
    {
      title: "Program Remedial Intensif",
      description: "Program khusus untuk siswa dengan nilai rendah",
      impact: {
        academic: "+12%",
        retention: "+15%",
        confidence: "+20%",
      },
    },
    {
      title: "Digitalisasi Pembelajaran",
      description: "Implementasi teknologi dalam semua mata pelajaran",
      impact: {
        engagement: "+25%",
        efficiency: "+18%",
        cost: "+10%",
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Kepala Sekolah</h1>
              <p className="text-gray-600">Monitoring dan analisis data sekolah secara komprehensif</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                SMA Negeri 1 Jakarta
              </Badge>
              <div className="text-right">
                <p className="text-sm text-gray-600">Akreditasi</p>
                <p className="text-xl font-bold text-purple-600">A</p>
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
              <School className="h-4 w-4" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analisis Rapor
            </TabsTrigger>
            <TabsTrigger value="policy" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Simulasi Kebijakan
            </TabsTrigger>
            <TabsTrigger value="alumni" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Keterserapan Alumni
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* School Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schoolStats.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Aktif</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schoolStats.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground">Pengajar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                  <School className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schoolStats.totalClasses}</div>
                  <p className="text-xs text-muted-foreground">Ruang kelas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schoolStats.averageScore}</div>
                  <p className="text-xs text-muted-foreground">Seluruh mapel</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schoolStats.attendanceRate}%</div>
                  <p className="text-xs text-muted-foreground">Rata-rata</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kelulusan</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schoolStats.graduationRate}%</div>
                  <p className="text-xs text-muted-foreground">3 tahun terakhir</p>
                </CardContent>
              </Card>
            </div>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performa Departemen</CardTitle>
                <CardDescription>Analisis performa setiap departemen mata pelajaran</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{dept.name}</h4>
                          <Badge variant={Number.parseFloat(dept.trend) > 0 ? "default" : "secondary"}>
                            {dept.trend}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <span>{dept.teachers} guru</span>
                          <span>{dept.students} siswa</span>
                          <span>Rata-rata: {dept.avgScore}</span>
                        </div>
                        <div className="mt-2">
                          <Progress value={dept.avgScore} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <ChatBot userRole="principal" />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Report Card Analysis Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Analisis Rapor Pendidikan Sekolah
                </CardTitle>
                <CardDescription>Analisis mendalam data rapor pendidikan dengan rekomendasi aksi</CardDescription>
              </CardHeader>
            </Card>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Literasi</CardTitle>
                  <CardDescription>Kemampuan membaca dan memahami</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{reportCardData.trends.literacy.current}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      {reportCardData.trends.literacy.change}
                    </Badge>
                    <span className="text-sm text-gray-600">dari periode sebelumnya</span>
                  </div>
                  <Progress value={reportCardData.trends.literacy.current} className="mt-3" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Numerasi</CardTitle>
                  <CardDescription>Kemampuan matematika dan logika</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">{reportCardData.trends.numeracy.current}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      {reportCardData.trends.numeracy.change}
                    </Badge>
                    <span className="text-sm text-gray-600">dari periode sebelumnya</span>
                  </div>
                  <Progress value={reportCardData.trends.numeracy.current} className="mt-3" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Karakter</CardTitle>
                  <CardDescription>Pengembangan karakter siswa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {reportCardData.trends.character.current}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      {reportCardData.trends.character.change}
                    </Badge>
                    <span className="text-sm text-gray-600">dari periode sebelumnya</span>
                  </div>
                  <Progress value={reportCardData.trends.character.current} className="mt-3" />
                </CardContent>
              </Card>
            </div>

            {/* Subject Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Perbandingan dengan Standar Nasional
                </CardTitle>
                <CardDescription>Performa sekolah dibandingkan dengan rata-rata nasional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportCardData.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{subject.name}</h4>
                          <Badge variant={subject.status === "above" ? "default" : "secondary"}>
                            {subject.status === "above" ? "Di Atas Nasional" : "Di Bawah Nasional"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                          <span>Sekolah: {subject.score}</span>
                          <span>Nasional: {subject.national}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Sekolah</span>
                            <span>{subject.score}%</span>
                          </div>
                          <Progress value={subject.score} className="h-2" />
                          <div className="flex justify-between text-xs">
                            <span>Nasional</span>
                            <span>{subject.national}%</span>
                          </div>
                          <Progress value={subject.national} className="h-2 opacity-50" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Rekomendasi Perbaikan
                </CardTitle>
                <CardDescription>Saran aksi berdasarkan analisis rapor pendidikan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg border-blue-200 bg-blue-50">
                    <h4 className="font-medium text-blue-800 mb-2">Prioritas Tinggi</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Tingkatkan program literasi untuk kelas X</li>
                      <li>• Perkuat pembelajaran matematika dasar</li>
                      <li>• Implementasi program remedial intensif</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg border-green-200 bg-green-50">
                    <h4 className="font-medium text-green-800 mb-2">Prioritas Sedang</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Perkuat program pengembangan karakter</li>
                      <li>• Tingkatkan kualitas pembelajaran IPS</li>
                      <li>• Optimalkan penggunaan teknologi</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Simulasi Kebijakan Sekolah
                </CardTitle>
                <CardDescription>Simulasi dampak kebijakan terhadap peningkatan mutu pendidikan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Policy Scenarios */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {policyScenarios.map((scenario, index) => (
                    <Card key={index} className="border-2 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg">{scenario.title}</CardTitle>
                        <CardDescription>{scenario.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          {Object.entries(scenario.impact).map(([key, value]) => (
                            <div key={key} className="text-center p-3 border rounded-lg">
                              <div className="text-lg font-bold text-green-600">{value}</div>
                              <p className="text-xs text-gray-600 capitalize">{key}</p>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full bg-transparent" variant="outline">
                          <Activity className="h-4 w-4 mr-2" />
                          Jalankan Simulasi
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Policy Impact Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5" />
                      Proyeksi Dampak Kebijakan
                    </CardTitle>
                    <CardDescription>Estimasi dampak jangka pendek dan panjang</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Dampak Jangka Pendek (6 bulan)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Peningkatan Nilai</span>
                            <span className="text-sm font-medium text-green-600">+5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Kehadiran Siswa</span>
                            <span className="text-sm font-medium text-green-600">+8%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Motivasi Belajar</span>
                            <span className="text-sm font-medium text-green-600">+12%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Dampak Jangka Panjang (2 tahun)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Akreditasi Sekolah</span>
                            <span className="text-sm font-medium text-blue-600">A → A+</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Daya Saing Alumni</span>
                            <span className="text-sm font-medium text-blue-600">+25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Kepuasan Orang Tua</span>
                            <span className="text-sm font-medium text-blue-600">+18%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alumni">
            <Card>
              <CardHeader>
                <CardTitle>Keterserapan Alumni</CardTitle>
                <CardDescription>
                  Tracking dan analisis keterserapan alumni di perguruan tinggi dan dunia kerja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fitur tracking alumni akan segera hadir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
