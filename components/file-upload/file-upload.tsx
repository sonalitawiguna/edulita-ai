"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, type File, X, CheckCircle, AlertCircle, Download, Eye } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  summary?: string
  extractedText?: string
}

interface FileUploadProps {
  userRole: string
}

export function FileUpload({ userRole }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading" as const,
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate file processing
    newFiles.forEach((file) => {
      simulateFileProcessing(file.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const simulateFileProcessing = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20

      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? {
                ...file,
                progress: Math.min(progress, 100),
                status: progress < 50 ? "uploading" : progress < 100 ? "processing" : "completed",
                summary: progress >= 100 ? generateMockSummary(file.name) : undefined,
                extractedText: progress >= 100 ? generateMockExtractedText() : undefined,
              }
            : file,
        ),
      )

      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 500)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusBadge = (status: UploadedFile["status"]) => {
    const variants = {
      uploading: { variant: "secondary" as const, text: "Mengunggah" },
      processing: { variant: "secondary" as const, text: "Memproses" },
      completed: { variant: "default" as const, text: "Selesai" },
      error: { variant: "destructive" as const, text: "Error" },
    }

    const { variant, text } = variants[status]
    return <Badge variant={variant}>{text}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Dokumen
          </CardTitle>
          <CardDescription>Upload file PDF, Word, atau teks untuk dianalisis dan diringkas oleh AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Lepaskan file di sini...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Drag & drop file di sini, atau klik untuk memilih</p>
                <p className="text-sm text-gray-500">Mendukung PDF, DOC, DOCX, TXT (maksimal 10MB)</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>File yang Diunggah</CardTitle>
            <CardDescription>Daftar file yang telah diunggah dan status pemrosesannya</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(file.status)}
                        <div>
                          <h4 className="font-medium">{file.name}</h4>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(file.status)}
                        <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {file.status !== "completed" && (
                      <div className="mb-3">
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{Math.round(file.progress)}% selesai</p>
                      </div>
                    )}

                    {file.summary && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <h5 className="font-medium text-sm mb-2">Ringkasan AI:</h5>
                        <p className="text-sm text-gray-700">{file.summary}</p>
                      </div>
                    )}

                    {file.status === "completed" && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Ringkasan
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function generateMockSummary(fileName: string): string {
  const summaries = [
    "Dokumen ini membahas konsep dasar matematika dengan fokus pada aljabar linear. Materi mencakup sistem persamaan linear, matriks, dan transformasi linear. Terdapat 15 contoh soal dengan pembahasan lengkap.",
    "File berisi materi fisika tentang hukum Newton dan aplikasinya. Dijelaskan tiga hukum Newton dengan contoh dalam kehidupan sehari-hari. Dilengkapi dengan 20 soal latihan dan kunci jawaban.",
    "Dokumen pembelajaran kimia yang membahas ikatan kimia, meliputi ikatan ion, kovalen, dan logam. Terdapat diagram dan ilustrasi yang membantu pemahaman konsep.",
    "Materi bahasa Indonesia tentang teks argumentasi. Membahas struktur, ciri-ciri, dan cara menulis teks argumentasi yang baik. Dilengkapi contoh teks dan latihan menulis.",
  ]

  return summaries[Math.floor(Math.random() * summaries.length)]
}

function generateMockExtractedText(): string {
  return "Teks telah berhasil diekstrak dari dokumen. AI telah menganalisis konten dan siap memberikan jawaban atas pertanyaan terkait materi ini."
}
