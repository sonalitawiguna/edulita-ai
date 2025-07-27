"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy, Clock, Target } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { quizService } from "@/lib/database"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  subject: string
}

interface QuizResult {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
}

export function QuizGenerator() {
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [currentQuiz, setCurrentQuiz] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const { user } = useAuth()

  const subjects = [
    { value: "matematika", label: "Matematika" },
    { value: "fisika", label: "Fisika" },
    { value: "kimia", label: "Kimia" },
    { value: "biologi", label: "Biologi" },
    { value: "bahasa-indonesia", label: "Bahasa Indonesia" },
    { value: "bahasa-inggris", label: "Bahasa Inggris" },
    { value: "sejarah", label: "Sejarah" },
    { value: "geografi", label: "Geografi" },
  ]

  const difficulties = [
    { value: "easy", label: "Mudah" },
    { value: "medium", label: "Sedang" },
    { value: "hard", label: "Sulit" },
  ]

  const generateQuiz = async () => {
    if (!selectedSubject || !selectedDifficulty) return

    setIsGenerating(true)
    try {
      // Fetch quizzes from database
      const allQuizzes = await quizService.getAllQuizzes()
      const filteredQuizzes = allQuizzes.filter(
        (quiz) =>
          quiz.subject.toLowerCase() === selectedSubject.toLowerCase() && quiz.difficulty === selectedDifficulty,
      )

      if (filteredQuizzes.length > 0) {
        const randomQuiz = filteredQuizzes[Math.floor(Math.random() * filteredQuizzes.length)]
        setCurrentQuiz([
          {
            id: randomQuiz.id,
            question: randomQuiz.questions[0]?.question || "Sample question",
            options: randomQuiz.questions[0]?.options || ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: randomQuiz.questions[0]?.correctAnswer || 0,
            explanation: randomQuiz.questions[0]?.explanation || "Sample explanation",
            difficulty: randomQuiz.difficulty,
            subject: randomQuiz.subject,
          },
        ])
      } else {
        // Fallback to mock data if no quizzes found
        const mockQuestions: Question[] = [
          {
            id: "1",
            question: "Berapakah hasil dari 2x + 5 = 15?",
            options: ["x = 5", "x = 10", "x = 7.5", "x = 2.5"],
            correctAnswer: 0,
            explanation:
              "Untuk menyelesaikan 2x + 5 = 15, kurangi 5 dari kedua sisi: 2x = 10, kemudian bagi dengan 2: x = 5",
            difficulty: selectedDifficulty as "easy" | "medium" | "hard",
            subject: selectedSubject,
          },
        ]
        setCurrentQuiz(mockQuestions)
      }

      setCurrentQuestionIndex(0)
      setQuizResults([])
      setShowResult(false)
      setSelectedAnswer("")
    } catch (error) {
      console.error("Error generating quiz:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || !user) return

    const currentQuestion = currentQuiz[currentQuestionIndex]
    const answerIndex = Number.parseInt(selectedAnswer)
    const isCorrect = answerIndex === currentQuestion.correctAnswer

    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
    }

    setQuizResults((prev) => [...prev, result])

    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer("")
    } else {
      // Quiz completed, save to database
      const finalResults = [...quizResults, result]
      const score = Math.round((finalResults.filter((r) => r.isCorrect).length / finalResults.length) * 100)

      try {
        await quizService.submitQuizAttempt({
          quiz_id: currentQuestion.id,
          student_id: user.id,
          answers: finalResults,
          score: score,
        })
      } catch (error) {
        console.error("Error saving quiz attempt:", error)
      }

      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuiz([])
    setCurrentQuestionIndex(0)
    setQuizResults([])
    setShowResult(false)
    setSelectedAnswer("")
    setSelectedSubject("")
    setSelectedDifficulty("")
  }

  const calculateScore = () => {
    const correctAnswers = quizResults.filter((result) => result.isCorrect).length
    return Math.round((correctAnswers / quizResults.length) * 100)
  }

  if (showResult) {
    const score = calculateScore()
    const correctAnswers = quizResults.filter((result) => result.isCorrect).length

    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Trophy className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Hasil Kuis</CardTitle>
          <CardDescription>Selamat! Anda telah menyelesaikan kuis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
            <p className="text-gray-600">
              {correctAnswers} dari {quizResults.length} jawaban benar
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Review Jawaban:</h3>
            {currentQuiz.map((question, index) => {
              const result = quizResults[index]
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {result.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Jawaban Anda: {question.options[result.selectedAnswer]}
                      </p>
                      {!result.isCorrect && (
                        <p className="text-sm text-green-600 mb-2">
                          Jawaban benar: {question.options[question.correctAnswer]}
                        </p>
                      )}
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={generateQuiz} variant="outline">
              Kuis Baru
            </Button>
            <Button onClick={resetQuiz}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Mulai Ulang
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentQuiz.length > 0) {
    const currentQuestion = currentQuiz[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Kuis {selectedSubject}</CardTitle>
              <CardDescription>
                Soal {currentQuestionIndex + 1} dari {currentQuiz.length}
              </CardDescription>
            </div>
            <Badge variant="secondary">{difficulties.find((d) => d.value === selectedDifficulty)?.label}</Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Sebelumnya
            </Button>
            <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
              {currentQuestionIndex === currentQuiz.length - 1 ? "Selesai" : "Selanjutnya"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quiz Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Generator Kuis AI
          </CardTitle>
          <CardDescription>Buat kuis otomatis berdasarkan mata pelajaran dan tingkat kesulitan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mata Pelajaran</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih mata pelajaran" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value}>
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tingkat Kesulitan</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tingkat kesulitan" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateQuiz}
            disabled={!selectedSubject || !selectedDifficulty || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Membuat Kuis...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Buat Kuis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Quiz History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Kuis Terbaru</CardTitle>
          <CardDescription>Hasil kuis yang telah Anda selesaikan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada riwayat kuis</p>
            <p className="text-sm text-gray-500">Mulai kuis pertama Anda untuk melihat riwayat</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
