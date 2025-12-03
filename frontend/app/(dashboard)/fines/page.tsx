'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Plus, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Fine {
  id: number
  userId: number
  loanId?: number
  reason: string
  description?: string
  isActive: boolean
  createdAt: string
  user: { name: string; email: string }
  loan?: { material: { title: string } }
}

export default function FinesPage() {
  const [fines, setFines] = useState<Fine[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchFines()
  }, [])

  const fetchFines = async () => {
    try {
      const response = await api.get('/fines?limit=50')
      setFines(response.data.data || [])
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar advertências',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      late_return: 'Devolução Atrasada',
      damaged_material: 'Material Danificado',
      rule_violation: 'Violação de Regras',
    }
    return labels[reason] || reason
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Advertências</h1>
        <Button asChild>
          <Link href="/fines/new">
            <Plus className="w-4 h-4 mr-2" />
            Nova Advertência
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Advertências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Usuário</th>
                  <th className="text-left p-2">Motivo</th>
                  <th className="text-left p-2">Descrição</th>
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((fine) => (
                  <tr key={fine.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{fine.user.name}</div>
                        <div className="text-sm text-muted-foreground">{fine.user.email}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
                        {getReasonLabel(fine.reason)}
                      </div>
                    </td>
                    <td className="p-2">{fine.description || '-'}</td>
                    <td className="p-2">
                      {format(new Date(fine.createdAt), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="p-2">
                      {fine.isActive ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          Ativa
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          Inativa
                        </span>
                      )}
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

