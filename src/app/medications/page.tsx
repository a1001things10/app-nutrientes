'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

interface Medication {
  id: string
  name: string
  dosage: string
  schedule: string
  reminders: boolean
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [schedule, setSchedule] = useState('')
  const [reminders, setReminders] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('medications')
    if (stored) {
      setMedications(JSON.parse(stored))
    }
  }, [])

  const addMedication = () => {
    if (!name) return

    const newMed: Medication = {
      id: Date.now().toString(),
      name,
      dosage,
      schedule,
      reminders,
    }

    const updated = [...medications, newMed]
    setMedications(updated)
    localStorage.setItem('medications', JSON.stringify(updated))

    setName('')
    setDosage('')
    setSchedule('')
    setReminders(false)
  }

  const deleteMedication = (id: string) => {
    const updated = medications.filter(med => med.id !== id)
    setMedications(updated)
    localStorage.setItem('medications', JSON.stringify(updated))
  }

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline">Voltar ao Início</Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Acompanhamento de Medicamentos</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Adicionar Medicamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Medicamento</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dosage">Dosagem</Label>
            <Input id="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="schedule">Horário (ex: 08:00)</Label>
            <Input id="schedule" type="time" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="reminders" checked={reminders} onCheckedChange={setReminders} />
            <Label htmlFor="reminders">Ativar lembretes</Label>
          </div>
          <Button onClick={addMedication}>Adicionar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meus Medicamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {medications.map(med => (
            <div key={med.id} className="border-b py-2 flex justify-between items-center">
              <div>
                <p><strong>{med.name}</strong> - {med.dosage}</p>
                <p>Horário: {med.schedule} | Lembretes: {med.reminders ? 'Sim' : 'Não'}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteMedication(med.id)}>Deletar</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}