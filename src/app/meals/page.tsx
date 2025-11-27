'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Loader2 } from 'lucide-react'

interface Meal {
  id: string
  date: string
  food: string
  quantity: number
  protein: number
  fiber: number
  carbs: number
  fat?: number
  vitamins?: string
  minerals?: string
  aminoacids?: string
  calories?: number
}

interface NutritionAnalysis {
  food: string
  quantity: number
  protein: number
  fiber: number
  carbs: number
  fat: number
  vitamins: string
  minerals: string
  aminoacids: string
  calories: number
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [food, setFood] = useState('')
  const [quantity, setQuantity] = useState('')
  const [protein, setProtein] = useState('')
  const [fiber, setFiber] = useState('')
  const [carbs, setCarbs] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('meals')
    if (stored) {
      setMeals(JSON.parse(stored))
    }
  }, [])

  const addMeal = () => {
    if (!food || !quantity) return

    const newMeal: Meal = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      food,
      quantity: parseFloat(quantity),
      protein: parseFloat(protein) || 0,
      fiber: parseFloat(fiber) || 0,
      carbs: parseFloat(carbs) || 0,
    }

    const updated = [...meals, newMeal]
    setMeals(updated)
    localStorage.setItem('meals', JSON.stringify(updated))

    setFood('')
    setQuantity('')
    setProtein('')
    setFiber('')
    setCarbs('')
    setCapturedImage(null)
  }

  const deleteMeal = (id: string) => {
    const updated = meals.filter(meal => meal.id !== id)
    setMeals(updated)
    localStorage.setItem('meals', JSON.stringify(updated))
  }

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)

    // Converter imagem para base64
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64Image = reader.result as string
      setCapturedImage(base64Image)

      try {
        // Chamar API para análise nutricional
        const response = await fetch('/api/analyze-food', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Image }),
        })

        if (!response.ok) {
          throw new Error('Erro ao analisar imagem')
        }

        const data: NutritionAnalysis = await response.json()

        // Preencher campos automaticamente
        setFood(data.food)
        setQuantity(data.quantity.toString())
        setProtein(data.protein.toString())
        setFiber(data.fiber.toString())
        setCarbs(data.carbs.toString())
      } catch (error) {
        console.error('Erro ao analisar imagem:', error)
        alert('Erro ao analisar a imagem. Tente novamente.')
      } finally {
        setIsAnalyzing(false)
      }
    }

    reader.readAsDataURL(file)
  }

  const todayMeals = meals.filter(meal => meal.date === new Date().toISOString().split('T')[0])
  const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0)
  const totalFiber = todayMeals.reduce((sum, meal) => sum + meal.fiber, 0)
  const totalCarbs = todayMeals.reduce((sum, meal) => sum + meal.carbs, 0)

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
            Voltar ao Início
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-green-800">🍽️ Registro de Alimentação</h1>

      <Card className="mb-6 border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500">
          <CardTitle className="text-white">📸 Analisar Prato com IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col items-center space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white w-full sm:w-auto"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-5 w-5" />
                  Tirar Foto do Prato
                </>
              )}
            </Button>
            {capturedImage && (
              <div className="w-full max-w-md">
                <img src={capturedImage} alt="Prato capturado" className="rounded-lg shadow-md w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500">
          <CardTitle className="text-white">➕ Adicionar Refeição Manual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="food" className="text-gray-700 font-semibold">Alimento</Label>
            <Input 
              id="food" 
              value={food} 
              onChange={(e) => setFood(e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="quantity" className="text-gray-700 font-semibold">Quantidade (g)</Label>
            <Input 
              id="quantity" 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="protein" className="text-gray-700 font-semibold">Proteína (g)</Label>
              <Input 
                id="protein" 
                type="number" 
                value={protein} 
                onChange={(e) => setProtein(e.target.value)}
                className="border-blue-300 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="fiber" className="text-gray-700 font-semibold">Fibra (g)</Label>
              <Input 
                id="fiber" 
                type="number" 
                value={fiber} 
                onChange={(e) => setFiber(e.target.value)}
                className="border-blue-300 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="carbs" className="text-gray-700 font-semibold">Carboidratos (g)</Label>
              <Input 
                id="carbs" 
                type="number" 
                value={carbs} 
                onChange={(e) => setCarbs(e.target.value)}
                className="border-blue-300 focus:border-blue-500"
              />
            </div>
          </div>
          <Button 
            onClick={addMeal}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white w-full"
          >
            Adicionar Refeição
          </Button>
        </CardContent>
      </Card>

      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500">
          <CardTitle className="text-white">📊 Refeições de Hoje</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-700">Total Proteína</p>
              <p className="text-2xl font-bold text-red-700">{totalProtein.toFixed(1)}g</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-700">Total Fibra</p>
              <p className="text-2xl font-bold text-yellow-700">{totalFiber.toFixed(1)}g</p>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-700">Total Carboidratos</p>
              <p className="text-2xl font-bold text-orange-700">{totalCarbs.toFixed(1)}g</p>
            </div>
          </div>
          <div className="space-y-3">
            {todayMeals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma refeição registrada hoje</p>
            ) : (
              todayMeals.map(meal => (
                <div key={meal.id} className="border-2 border-purple-200 bg-white rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-bold text-lg text-purple-800">{meal.food}</p>
                    <p className="text-sm text-gray-600">Quantidade: {meal.quantity}g</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                        Proteína: {meal.protein}g
                      </span>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
                        Fibra: {meal.fiber}g
                      </span>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                        Carboidratos: {meal.carbs}g
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => deleteMeal(meal.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Deletar
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}