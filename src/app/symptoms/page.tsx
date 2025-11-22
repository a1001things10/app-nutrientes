'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface Symptom {
  id: string
  date: string
  symptom: string
  severity: number
  notes: string
}

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [symptom, setSymptom] = useState('')
  const [severity, setSeverity] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('symptoms')
    if (stored) {
      setSymptoms(JSON.parse(stored))
    }
  }, [])

  const addSymptom = () => {
    if (!symptom) return

    const newSymptom: Symptom = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      symptom,
      severity: parseInt(severity) || 1,
      notes,
    }

    const updated = [...symptoms, newSymptom]
    setSymptoms(updated)
    localStorage.setItem('symptoms', JSON.stringify(updated))

    setSymptom('')
    setSeverity('')
    setNotes('')
  }

  const deleteSymptom = (id: string) => {
    const updated = symptoms.filter(s => s.id !== id)
    setSymptoms(updated)
    localStorage.setItem('symptoms', JSON.stringify(updated))
  }

  const todaySymptoms = symptoms.filter(s => s.date === new Date().toISOString().split('T')[0])

  return (
    <div className="container mx-auto p-4 bg-red-50 min-h-screen">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline">Voltar ao Início</Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-red-800">Registro de Sintomas</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Registrar Sintoma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="symptom">Sintoma</Label>
            <Input id="symptom" value={symptom} onChange={(e) => setSymptom(e.target.value)} placeholder="Ex: Dor de cabeça" />
          </div>
          <div>
            <Label htmlFor="severity">Gravidade (1-10)</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a gravidade" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notas Adicionais</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Descreva mais detalhes..." />
          </div>
          <Button onClick={addSymptom}>Registrar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sintomas de Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          {todaySymptoms.length === 0 ? (
            <p>Nenhum sintoma registrado hoje.</p>
          ) : (
            todaySymptoms.map(s => (
              <div key={s.id} className="border-b py-2 flex justify-between items-center">
                <div>
                  <p><strong>{s.symptom}</strong> - Gravidade: {s.severity}/10</p>
                  <p>{s.notes}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => deleteSymptom(s.id)}>Deletar</Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}