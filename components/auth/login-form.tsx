"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const userRoles = [
  { value: "student", label: "Siswa" },
  { value: "teacher", label: "Guru" },
  { value: "principal", label: "Kepala Sekolah" },
  { value: "department", label: "Dinas Pendidikan" },
  { value: "industry", label: "Industri" },
  { value: "superadmin", label: "Super Admin" },
]

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setError("")

    // Validation
    if (!email || !password || !role) {
      setError("Semua field harus diisi")
      return
    }

    if (!email.includes("@")) {
      setError("Format email tidak valid")
      return
    }

    if (password.length < 3) {
      setError("Password minimal 3 karakter")
      return
    }

    try {
      await login(email, password, role)

      // Show success message
      toast({
        title: "Login Berhasil!",
        description: `Selamat datang sebagai ${userRoles.find((r) => r.value === role)?.label}`,
        duration: 3000,
      })

      // Redirect based on role
      const dashboardRoutes = {
        student: "/dashboard/student",
        teacher: "/dashboard/teacher",
        principal: "/dashboard/principal",
        department: "/dashboard/department",
        industry: "/dashboard/industry",
        superadmin: "/dashboard/admin",
      }

      const targetRoute = dashboardRoutes[role as keyof typeof dashboardRoutes]

      // Small delay to show success message
      setTimeout(() => {
        router.push(targetRoute)
      }, 500)
    } catch (error) {
      console.error("Login failed:", error)
      setError(error instanceof Error ? error.message : "Login gagal. Silakan coba lagi.")

      toast({
        title: "Login Gagal",
        description: "Terjadi kesalahan saat login. Silakan coba lagi.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  // Demo credentials helper
  const fillDemoCredentials = (demoRole: string) => {
    const demoCredentials = {
      student: { email: "siswa@demo.com", password: "password123" },
      teacher: { email: "guru@demo.com", password: "password123" },
      principal: { email: "kepsek@demo.com", password: "password123" },
      department: { email: "dinas@demo.com", password: "password123" },
      industry: { email: "industri@demo.com", password: "password123" },
      superadmin: { email: "admin@demo.com", password: "password123" },
    }

    const creds = demoCredentials[demoRole as keyof typeof demoCredentials]
    if (creds) {
      setEmail(creds.email)
      setPassword(creds.password)
      setRole(demoRole)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Masuk ke Edulita Insight</CardTitle>
        <CardDescription>Masukkan kredensial Anda untuk mengakses platform</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@sekolah.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <Select value={role} onValueChange={setRole} disabled={isLoading} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih peran Anda" />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map((roleOption) => (
                  <SelectItem key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Masuk
              </>
            )}
          </Button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-gray-600 mb-3 text-center">Demo Credentials (Klik untuk mengisi otomatis):</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("student")}
              disabled={isLoading}
              className="text-xs"
            >
              Siswa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("teacher")}
              disabled={isLoading}
              className="text-xs"
            >
              Guru
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("principal")}
              disabled={isLoading}
              className="text-xs"
            >
              Kepala Sekolah
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("department")}
              disabled={isLoading}
              className="text-xs"
            >
              Dinas
            </Button>
          </div>
        </div>

        {/* Development Mode Notice */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Mode Development</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Anda dapat menggunakan email dan password apapun untuk testing. Pilih role sesuai dashboard yang ingin
            diakses.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
