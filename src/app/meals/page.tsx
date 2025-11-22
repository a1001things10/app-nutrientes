'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Meal {
  id: string
  date: string
  food: string
  quantity: number
  protein: number
  fiber: number
  carbs: number
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [food, setFood] = useState('')
  const [quantity, setQuantity] = useState('')
  const [protein, setProtein] = useState('')
  const [fiber, setFiber] = useState('')
  const [carbs, setCarbs] = useState('')

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
  }

  const deleteMeal = (id: string) => {
    const updated = meals.filter(meal => meal.id !== id)
    setMeals(updated)
    localStorage.setItem('meals', JSON.stringify(updated))
  }

  const todayMeals = meals.filter(meal => meal.date === new Date().toISOString().split('T')[0])
  const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0)
  const totalFiber = todayMeals.reduce((sum, meal) => sum + meal.fiber, 0)
  const totalCarbs = todayMeals.reduce((sum, meal) => sum + meal.carbs, 0)

  return (
    <div className="container mx-auto p-4 bg-green-50 min-h-screen">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline">Voltar ao Início</Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-green-800">Registro de Alimentação</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Adicionar Refeição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="food">Alimento</Label>
            <Input id="food" value={food} onChange={(e) => setFood(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="quantity">Quantidade (g)</Label>
            <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="protein">Proteína (g)</Label>
              <Input id="protein" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="fiber">Fibra (g)</Label>
              <Input id="fiber" type="number" value={fiber} onChange={(e) => setFiber(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="carbs">Carboidratos (g)</Label>
              <Input id="carbs" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
            </div>
          </div>
          <Button onClick={addMeal}>Adicionar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Refeições de Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p>Total Proteína: <span className="font-bold text-green-600">{totalProtein.toFixed(1)}g</span></p>
            <p>Total Fibra: <span className="font-bold text-green-600">{totalFiber.toFixed(1)}g</span></p>
            <p>Total Carboidratos: <span className="font-bold text-green-600">{totalCarbs.toFixed(1)}g</span></p>
          </div>
          {todayMeals.map(meal => (
            <div key={meal.id} className="border-b py-2 flex justify-between items-center">
              <div>
                <p><strong>{meal.food}</strong> - {meal.quantity}g</p>
                <p>Proteína: {meal.protein}g, Fibra: {meal.fiber}g, Carboidratos: {meal.carbs}g</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteMeal(meal.id)}>Deletar</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}