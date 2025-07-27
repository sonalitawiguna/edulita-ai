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
  Building2,
  Users,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Settings,
  Award,
  Target,
  BookOpen,
  LogOut,
  MapPin,
  GraduationCap,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react"

export function DepartmentDashboard() {
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

  const regionStats = {
    totalSchools: 125,
    totalStudents: 45250,
    totalTeachers: 2150,
    averageAccreditation: "B+",
    budgetUtilization: 87.5,
    graduationRate: 96.2,
  }

  const schoolData = [
    { name: "SMA Negeri 1", students: 1250, teachers: 45, accreditation: "A", performance: 92 },
    { name: "SMA Negeri 2", students: 980, teachers: 38, accreditation: "A", performance: 89 },
    { name: "SMA Negeri 3", students: 850, teachers: 32, accreditation: "B", performance: 85 },
    { name: "SMA Negeri 4", students: 720, teachers: 28, accreditation: "B", performance: 82 },
  ]

  const analyticsData = {
    performanceByRegion: [
      { region: "Jakarta Pusat", schools: 25, avgScore: 85.2, trend: "+2.1%" },
      { region: "Jakarta Utara", schools: 30, avgScore: 83.7, trend: "+1.8%" },
      { region: "Jakarta Selatan", schools: 35, avgScore: 87.1, trend: "+2.5%" },
      { region: "Jakarta Timur", schools: 20, avgScore: 81.4, trend: "+0.9%" },
      { region: "Jakarta Barat", schools: 15, avgScore: 84.3, trend: "+1.7%" },
    ],
    budgetAnalysis: [
      { category: "Infrastruktur", allocated: 45, used: 38, percentage: 84 },
      { category: "SDM", allocated: 30, used: 28, percentage: 93 },
      { category: "Kurikulum", allocated: 15, used: 12, percentage: 80 },
      { category: "Teknologi", allocated: 10, used: 9, percentage: 90 },
    ],
    studentFlow: {
      enrollment: 12450,
      graduation: 11890,
      dropout: 560,
      retention: 95.5,
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Dinas Pendidikan</h1>
              <p className="text-gray-600">Monitoring dan analisis data pendidikan daerah</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <MapPin className="h-3 w-3 mr-1" />
                Kota Jakarta
              </Badge>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Sekolah</p>
                <p className="text-xl font-bold text-green-600">{regionStats.totalSchools}</p>
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
              <Building2 className="h-4 w-4" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard Analitik
            </TabsTrigger>
            <TabsTrigger value="policy" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Simulasi Kebijakan
            </TabsTrigger>
            <TabsTrigger value="alumni" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Link & Match
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Region Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sekolah</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{regionStats.totalSchools}</div>
                  <p className="text-xs text-muted-foreground">Semua jenjang</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{regionStats.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Aktif</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{regionStats.totalTeachers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Pengajar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rata-rata Akreditasi</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{regionStats.averageAccreditation}</div>
                  <p className="text-xs text-muted-foreground">Regional</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisasi Anggaran</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{regionStats.budgetUtilization}%</div>
                  <p className="text-xs text-muted-foreground">Tahun ini</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tingkat Kelulusan</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{regionStats.graduationRate}%</div>
                  <p className="text-xs text-muted-foreground">3 tahun terakhir</p>
                </CardContent>
              </Card>
            </div>

            {/* School Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performa Sekolah Unggulan</CardTitle>
                <CardDescription>Ranking sekolah berdasarkan indeks kinerja</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schoolData.map((school, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{school.name}</h4>
                          <Badge variant={school.accreditation === "A" ? "default" : "secondary"}>
                            Akreditasi {school.accreditation}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                          <span>{school.students} siswa</span>
                          <span>{school.teachers} guru</span>
                          <span>Kinerja: {school.performance}%</span>
                        </div>
                        <div>
                          <Progress value={school.performance} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <ChatBot userRole="department" />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Siswa Baru</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.studentFlow.enrollment.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+5.2% dari tahun lalu</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lulusan</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.studentFlow.graduation.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+2.1% dari tahun lalu</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Putus Sekolah</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.studentFlow.dropout}</div>
                  <p className="text-xs text-red-600">-1.2% dari tahun lalu</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Retensi</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.studentFlow.retention}%</div>
                  <p className="text-xs text-green-600">+0.8% dari tahun lalu</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance by Region */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Performa Berdasarkan Wilayah
                </CardTitle>
                <CardDescription>Analisis performa sekolah per wilayah administrasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performanceByRegion.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{region.region}</h4>
                          <Badge variant="outline" className="text-green-600">
                            {region.trend}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                          <span>{region.schools} sekolah</span>
                          <span>Rata-rata: {region.avgScore}</span>
                        </div>
                        <Progress value={region.avgScore} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Analisis Anggaran
                </CardTitle>
                <CardDescription>Utilisasi anggaran per kategori (dalam miliar rupiah)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.budgetAnalysis.map((budget, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{budget.category}</h4>
                          <span className="text-sm text-gray-600">
                            {budget.used}M / {budget.allocated}M
                          </span>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Utilisasi</span>
                          <span>{budget.percentage}%</span>
                        </div>
                        <Progress value={budget.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Simulasi Kebijakan Pendidikan
                </CardTitle>
                <CardDescription>Simulasi dampak kebijakan terhadap mutu pendidikan daerah</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Policy Scenarios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Skenario 1: Peningkatan Anggaran Guru</CardTitle>
                      <CardDescription>Simulasi peningkatan anggaran guru sebesar 20%</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Rasio Guru-Siswa</span>
                          <span className="text-sm font-medium text-green-600">1:18 → 1:15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Kualitas Pembelajaran</span>
                          <span className="text-sm font-medium text-green-600">+12%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Nilai Rata-rata</span>
                          <span className="text-sm font-medium text-green-600">82.5 → 85.2</span>
                        </div>
                        <Button className="w-full mt-4 bg-transparent" variant="outline">
                          <Activity className="h-4 w-4 mr-2" />
                          Jalankan Simulasi
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Skenario 2: Program Digitalisasi</CardTitle>
                      <CardDescription>Simulasi implementasi teknologi di semua sekolah</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Akses Digital</span>
                          <span className="text-sm font-medium text-green-600">45% → 85%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Efisiensi Administrasi</span>
                          <span className="text-sm font-medium text-green-600">+25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Engagement Siswa</span>
                          <span className="text-sm font-medium text-green-600">+18%</span>
                        </div>
                        <Button className="w-full mt-4 bg-transparent" variant="outline">
                          <Activity className="h-4 w-4 mr-2" />
                          Jalankan Simulasi
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Skenario 3: Program Beasiswa</CardTitle>
                      <CardDescription>Simulasi program beasiswa untuk siswa berprestasi</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Tingkat Putus Sekolah</span>
                          <span className="text-sm font-medium text-green-600">4.5% → 2.1%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Motivasi Belajar</span>
                          <span className="text-sm font-medium text-green-600">+22%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Kelulusan ke PT</span>
                          <span className="text-sm font-medium text-green-600">65% → 78%</span>
                        </div>
                        <Button className="w-full mt-4 bg-transparent" variant="outline">
                          <Activity className="h-4 w-4 mr-2" />
                          Jalankan Simulasi
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Skenario 4: Infrastruktur Sekolah</CardTitle>
                      <CardDescription>Simulasi perbaikan infrastruktur sekolah</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Kondisi Bangunan</span>
                          <span className="text-sm font-medium text-green-600">70% → 90%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Kehadiran Siswa</span>
                          <span className="text-sm font-medium text-green-600">+8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Kepuasan Guru</span>
                          <span className="text-sm font-medium text-green-600">+15%</span>
                        </div>
                        <Button className="w-full mt-4 bg-transparent" variant="outline">
                          <Activity className="h-4 w-4 mr-2" />
                          Jalankan Simulasi
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Policy Impact Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ringkasan Dampak Kebijakan</CardTitle>
                    <CardDescription>Proyeksi dampak jangka panjang dari implementasi kebijakan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">+15%</div>
                        <p className="text-sm text-gray-600">Peningkatan Kualitas</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">-30%</div>
                        <p className="text-sm text-gray-600">Pengurangan Dropout</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">+25%</div>
                        <p className="text-sm text-gray-600">Efisiensi Anggaran</p>
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
                <CardTitle>Link & Match Alumni</CardTitle>
                <CardDescription>Analisis keterserapan alumni dan kesesuaian dengan kebutuhan industri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fitur link & match akan segera hadir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
