'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface Reservation {
  id: number
  materialId: number
  userId: number
  priorityLevel: number
  createdAt: string
  user: { name: string; email: string }
  material: { title: string; internalCode: string }
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations?limit=50')
      setReservations(response.data.data || [])
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar reservas',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reservas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Material</th>
                  <th className="text-left p-2">Usuário</th>
                  <th className="text-left p-2">Prioridade</th>
                  <th className="text-left p-2">Data da Reserva</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{reservation.material.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.material.internalCode}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{reservation.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {reservation.priorityLevel}
                      </span>
                    </td>
                    <td className="p-2">
                      {format(new Date(reservation.createdAt), 'dd/MM/yyyy HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

