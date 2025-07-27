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
  Factory,
  Users,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Award,
  Target,
  BookOpen,
  LogOut,
  Briefcase,
  GraduationCap,
} from "lucide-react"

export function IndustryDashboard() {
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

  const industryStats = {
    totalPartnership: 45,
    totalInterns: 320,
    totalHired: 180,
    satisfactionRate: 92.5,
    skillMatchRate: 87.3,
    retentionRate: 94.1,
  }

  const partnershipData = [
    { school: "SMA Negeri 1", program: "Magang IT", participants: 25, hired: 18, satisfaction: 95 },
    { school: "SMK Teknologi", program: "Praktik Industri", participants: 40, hired: 32, satisfaction: 92 },
    { school: "SMA Negeri 3", program: "Job Shadowing", participants: 15, hired: 8, satisfaction: 88 },
    { school: "SMK Bisnis", program: "Dual System", participants: 30, hired: 22, satisfaction: 90 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Mitra Industri</h1>
              <p className="text-gray-600">Kolaborasi pendidikan-industri untuk masa depan yang lebih baik</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <Factory className="h-3 w-3 mr-1" />
                PT. Tech Indonesia
              </Badge>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Kemitraan</p>
                <p className="text-xl font-bold text-orange-600">{industryStats.totalPartnership}</p>
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
              <Factory className="h-4 w-4" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analisis Alumni
            </TabsTrigger>
            <TabsTrigger value="partnership" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Program Kemitraan
            </TabsTrigger>
            <TabsTrigger value="recruitment" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Rekrutmen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Industry Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Kemitraan</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{industryStats.totalPartnership}</div>
                  <p className="text-xs text-muted-foreground">Sekolah mitra</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Magang</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{industryStats.totalInterns}</div>
                  <p className="text-xs text-muted-foreground">Peserta aktif</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Rekrutmen</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{industryStats.totalHired}</div>
                  <p className="text-xs text-muted-foreground">Alumni diterima</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tingkat Kepuasan</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{industryStats.satisfactionRate}%</div>
                  <p className="text-xs text-muted-foreground">Rata-rata</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kesesuaian Skill</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{industryStats.skillMatchRate}%</div>
                  <p className="text-xs text-muted-foreground">Match rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Retensi Karyawan</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{industryStats.retentionRate}%</div>
                  <p className="text-xs text-muted-foreground">1 tahun pertama</p>
                </CardContent>
              </Card>
            </div>

            {/* Partnership Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performa Program Kemitraan</CardTitle>
                <CardDescription>Evaluasi efektivitas program kolaborasi dengan sekolah</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partnershipData.map((partnership, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{partnership.school}</h4>
                          <Badge variant="outline">{partnership.program}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                          <span>{partnership.participants} peserta</span>
                          <span>{partnership.hired} diterima</span>
                          <span>Kepuasan: {partnership.satisfaction}%</span>
                        </div>
                        <div>
                          <Progress value={partnership.satisfaction} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <ChatBot userRole="industry" />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analisis Keterserapan Alumni</CardTitle>
                <CardDescription>
                  Insight mendalam tentang kesesuaian kompetensi alumni dengan kebutuhan industri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Fitur analisis alumni akan segera hadir</p>
                  <Button>Akses Dashboard Analitik</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partnership">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Program Kemitraan</CardTitle>
                <CardDescription>Kelola program magang, praktik industri, dan kerjasama pendidikan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fitur manajemen kemitraan akan segera hadir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recruitment">
            <Card>
              <CardHeader>
                <CardTitle>Portal Rekrutmen Alumni</CardTitle>
                <CardDescription>Platform rekrutmen khusus untuk alumni sekolah mitra</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Portal rekrutmen akan segera hadir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
