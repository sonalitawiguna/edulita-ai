import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Brain, Users, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Edulita Insight</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Platform Pendidikan AI Multimodal untuk Meningkatkan Mutu Pendidikan
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features Section */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <Brain className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">AI Chatbot Adaptif</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Asisten pembelajaran berbasis AI yang memahami kebutuhan setiap pengguna
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <Users className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle className="text-lg">Multi-Role System</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Mendukung siswa, guru, kepala sekolah, dinas, dan industri</CardDescription>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle className="text-lg">Analisis Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Visualisasi dan analisis mendalam untuk pengambilan keputusan</CardDescription>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <GraduationCap className="h-8 w-8 text-orange-600 mb-2" />
                  <CardTitle className="text-lg">Pembelajaran Personal</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Rekomendasi dan konten yang disesuaikan dengan kebutuhan individual</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Login Form */}
          <div className="flex justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
